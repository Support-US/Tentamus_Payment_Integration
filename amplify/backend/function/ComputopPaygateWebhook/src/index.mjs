import AWS from 'aws-sdk';
import { Blowfish } from 'egoroof-blowfish';
import { Buffer } from 'buffer';
import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';

import axios from 'axios';
import pkg from 'crypto-js';
const { HmacSHA256, enc } = pkg;  
const client = new DynamoDBClient({ region: process.env.REGION });
const secretsManager = new AWS.SecretsManager();
const data = await secretsManager.getSecretValue({SecretId: `Tentamus_Payment_Integration-Master`}).promise(); 
let HMacPassword,blowfishKey,merchantID;
const secretValue = JSON.parse(data.SecretString);
console.log("secretValue : ", secretValue);   
const PaymentDetailsTableName = secretValue.DBTable;            

export const handler = async (event) => {
            console.log(`Request EVENT: ${JSON.stringify(event)}`);
           
    try {
        if(event.queryStringParameters.q == secretValue.CFLCompanyName){
            HMacPassword = secretValue['Columbia Laboratories HMacPassword'];
            blowfishKey = secretValue['Columbia Laboratories blowfishKey'];
            merchantID  = secretValue['Columbia Laboratories MerchantID'];
          }
          else if(event.queryStringParameters.q == secretValue.TNAVCompanyName){ 
            HMacPassword = secretValue['Tentamus North America Virginia HMacPassword'];
            blowfishKey = secretValue['Tentamus North America Virginia blowfishKey'];
            merchantID  = secretValue['Tentamus North America Virginia MerchantID'];
          }
          else if(event.queryStringParameters.q == secretValue.AALCompanyName){
            HMacPassword = secretValue['Adamson Analytical Labs HMacPassword'];
            blowfishKey = secretValue['Adamson Analytical Labs blowfishKey'];
            merchantID  = secretValue['Adamson Analytical Labs MerchantID'];
          }
        else{
          return {
                    statusCode: 200,
                    body: "Data Not Found",
                     };
                   }
        
        
        let encryptedString = event.body;
        encryptedString = encryptedString.split('Data=').pop();

        // Base64 encode the encrypted text before sending it to AWS Lambda
        const base64EncodedString = Buffer.from(encryptedString, 'hex').toString('base64');
        
        // Decrypt the string
        const decryptedString =await  BlowfishDecryption(base64EncodedString, blowfishKey);

        // Parse the URL-encoded string into an object
        const parsedObject = await parseUrlEncodedString(decryptedString);
        console.log("parsedObject :", parsedObject);
 
        // Calculate the HMAC
        const calculatedHMAC =await generateHMAC(parsedObject.PayID,parsedObject.TransID,merchantID , parsedObject.Status ,parsedObject.Code,HMacPassword);
        console.log("calculatedHMAC :", calculatedHMAC);
        const Hmac = parsedObject.MAC;
        console.log("Hmac :", Hmac);
        
        
        //Get ObjectID
        const getObjectID =await GetObjectid(parsedObject.refnr);
        console.log("getObjectID :", getObjectID);
        
        if (Hmac.trim() === calculatedHMAC.trim()) {
            let response = await CreateData(parsedObject,getObjectID);
            console.log("response :",response); 
            
             return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Request processed successfully' }),
        };
        }
        else{
            console.log("Error : '⚠️HMAC validation failed' ");
            return {
                statusCode: 403,
                body: JSON.stringify({ success: false, message: '⚠️HMAC validation failed' }),
            };
        }   
        
            
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 200,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
        
        
    } 

async function parseUrlEncodedString(urlEncodedString) {
    if (urlEncodedString === undefined) {
        return 'undefined';
    }

    try {
        // Decoding the URL-encoded string with proper error handling
        const decodedString = decodeURIComponent(urlEncodedString.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'));

        const pairs = decodedString.split('&');
        const result = {};

        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            result[key] = value;
        }
        return result;
    } catch (error) {
        console.error('Error decoding URL-encoded string:', error);
        return 'error';
    }
}

async function BlowfishDecryption(base64EncodedText, key){
    // console.log("ENCODED TEXT", base64EncodedText);

    const bf = new Blowfish(key, 0, 3);

    // Convert the Base64-encoded string to a Buffer
    const encodedBuffer = Buffer.from(base64EncodedText, 'base64');

    // Convert the hex string to a Buffer
    const hexString = encodedBuffer.toString('hex');
    const decodedBuffer = Buffer.from(hexString, 'hex');

    // Decryption
    const decodedText = bf.decode(decodedBuffer).toString('utf-8');
    console.log("DECODED TEXT", decodedText);

    return decodedText;
}

async function generateHMAC(PayID,transID, merchantID, Status, code, hmacPassword){
            const message = `${PayID}*${transID}*${merchantID}*${Status}*${code}`;
            // console.log("Message", message, "secretKey", hmacPassword);

            const hash = HmacSHA256(message, hmacPassword);
            const hashInHex = hash.toString(enc.Hex);
            // console.log("hashInHex---", hashInHex);
        
        return hashInHex.toUpperCase();
  }
  
async function GetObjectid(TransID) {
    console.log("TransID :",TransID);
    const params = {
        TableName: PaymentDetailsTableName,
        Key: {
            id: { S: TransID },
        },
    };

    try {
        const command = new GetItemCommand(params);
        const response = await client.send(command);

        // Access the retrieved item from response.Item
        const item = response.Item;

        // Handle the retrieved item as needed
        console.log('Retrieved Item:', item);

        return item;
    } catch (error) {
        console.error('Error retrieving item:', error);
        throw error;
    }
}

async function CreateData(parsedObject,getObjectID){

    try{
    let getDBData = unmarshall(getObjectID);
    
    let postData = {
            PaymentID: parsedObject.PayID,
            Status: parsedObject.Status === 'OK' ? 'Success' : 'Failed',
        };

        console.log("Postdata:", JSON.stringify(postData));

        try {

            // Send data to SAP API
            const response = await axios.patch(
              `${(secretValue).SAPHostName}/sap/byd/odata/cust/v1/payment_advice/ZPaymentAdviceRootCollection('${getDBData.SAPObjectID}')`,
                postData,
                {
                    headers: {
                        
                        'Content-Type': 'application/json',
                       
                        Authorization: "Basic " + Buffer.from(`${secretValue.OdataUsername}:${secretValue.OdataPassword}`).toString("base64"),
                    },
                }
            );

            console.log("API RESPONSE For CREATE PaymentDetails ---->", response.status);
            console.log("Response Body:", JSON.stringify(response.data));
            const responseData = response.results;
             
            if (response.status === 204) {
                const updatedResponse = await UpdatePaymentDetailsID(parsedObject);
                console.log("updatedResponse :", updatedResponse);
                return {
                    statusCode: 204,
                    body: updatedResponse,
                };
            } else {
                const UpdateFailureStatus = await UpdateFailurestatus(responseData,parsedObject,"");
                console.log("UpdateFailurestatus :", UpdateFailureStatus);
                    
                return {
                    statusCode: response.status,
                    body: JSON.stringify({ error: "SAP server is down" }),
                };
            } 
        } catch (err) {
            console.error("ERROR:", err);
            
            const UpdateFailureStatus = await UpdateFailurestatus(err,parsedObject,"ServerError");
            console.log("UpdateFailurestatus :", UpdateFailureStatus);
            return {
                statusCode: err.statusCode,
                body: JSON.stringify({ error: err.message }),
            };
        }
    } catch (error) {
        console.error("Error parsing event:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Bad Request" }),
        };
    }
}

async function UpdatePaymentDetailsID(parsedObject) {
    const params = {
        TableName: PaymentDetailsTableName,
        Key: {
            id: { S: parsedObject.refnr },
        },
        UpdateExpression: "SET PaymentId = :newPaymentId, PaymentStatus = :newStatus,AfterPaymentSAPstatus = :newStatusMessage,Description = :newDescription",
        ExpressionAttributeValues: {
            ":newPaymentId": { S: parsedObject.PayID },
            ":newStatus": { S: parsedObject.Status === 'OK' ? 'Success' : 'Failed'}, 
            ":newStatusMessage": { S: "Success"},
            ":newDescription": { S: parsedObject.Description },
        },
        ReturnValues: "ALL_NEW",
    };

    const command = new UpdateItemCommand(params);
    const DBResponse = await client.send(command);  
    console.log("DBResponse :", DBResponse);
    return DBResponse;
}

async function UpdateFailurestatus(error,parsedObject,errStatus) {
    let params;
    if(errStatus ==  ""){
         params = {
        TableName: PaymentDetailsTableName,
        Key: {
            id: { S: parsedObject.refnr },
        },
        UpdateExpression: "SET PaymentStatus = :newStatus, AfterPaymentSAPstatus = :newStatusMessage,SAPErrorMessage = :newErrorMessage",
        ExpressionAttributeValues: {
            ":newStatus": { S: parsedObject.Status === 'OK' ? 'Success' : 'Failed' },
            ":newStatusMessage": { S : "Failed" },
            ":newErrorMessage": { M: { "ErrorMessage": { S: error.message } } },
        },
        ReturnValues: "ALL_NEW",
    };
    }
    else{
     params = {
        TableName: PaymentDetailsTableName,
        Key: {
            id: { S: parsedObject.refnr },
        },
        UpdateExpression: "SET PaymentStatus = :newStatus, AfterPaymentSAPstatus = :newStatusMessage,SAPErrorMessage = :newErrorMessage",
        ExpressionAttributeValues: {
            ":newStatus": { S: parsedObject.Status === 'OK' ? 'Success' : 'Failed' },
            ":newStatusMessage": { S : "Failed" },
            ":newErrorMessage": { M: { "ErrorMessage": { S: error.message } } },
        },
        
        ReturnValues: "ALL_NEW",
    };
}
    const command = new UpdateItemCommand(params);

    try {
        const DBResponse = await client.send(command);
        console.log("DBResponse :", DBResponse);
        return DBResponse;
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
} 


};
