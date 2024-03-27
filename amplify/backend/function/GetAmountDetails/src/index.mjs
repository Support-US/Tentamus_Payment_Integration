import AWS from 'aws-sdk';
import {DynamoDBClient,GetItemCommand ,PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Blowfish } from 'egoroof-blowfish';
import { Buffer } from 'buffer';
import pkg from 'crypto-js';
const { HmacSHA256, enc } = pkg;

const secretsManager = new AWS.SecretsManager();
const data = await secretsManager.getSecretValue({SecretId: `Tentamus_Payment_Integration`}).promise(); 
const secretValue = JSON.parse(data.SecretString);
const HMacPassword = secretValue.HMacPassword;
const blowfishKey = secretValue.blowfishKey;
const merchantID  = secretValue.MerchantID;
const notifyURL   =secretValue.APIGatewayURL;

const client = new DynamoDBClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-4mqwuuijsrbx5p6qtibxxchbsq-dev`;

export const handler = async (event) => {

    console.log(`EVENT: ${JSON.stringify(event)}`);
    
    const body = JSON.parse(event.body);
        
         let TableID =body.id;
         let PayId =body.payId ;
         let Status =body.status;
         let Code =body.code;
         
         console.log("TableID",TableID);
         console.log("PayId",PayId);
         console.log("Status",Status);
         console.log("Code",Code);
    try{
         // Calculate the HMAC
        const calculatedHMAC =await RetrygenerateHMAC(PayId ,TableID, merchantID , Status ,Code,HMacPassword);
        console.log("calculatedHMAC :", calculatedHMAC);
        const Hmac = body.mac;
        console.log("Hmac :", Hmac);
        
         if (Hmac.trim() === calculatedHMAC.trim() && !event.headers.hasOwnProperty('x-retry')) {
            
         //Get ObjectID
         const GetDBData =await getDBData(TableID);
         console.log("getObjectID :", GetDBData);
         
         let getData = unmarshall(GetDBData);
         console.log("getData",getData );
         
         let returnData ={
                      Amount: getData.Amount,
                      Currency:getData.Currency,
                      ClientName:getData.ClientName,
                     };
                                
                    return {
                                statusCode: 200,
                                headers: {
                                        "Access-Control-Allow-Headers" : "Content-Type",
                                        "Access-Control-Allow-Origin": "http://localhost:3000",
                                        // "Access-Control-Allow-Origin": "https://development.d389b8rydflvtl.amplifyapp.com",
                                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                                         },
                                body: JSON.stringify(returnData),
                            };
                
         }else {
            if (Hmac.trim() === calculatedHMAC.trim() && Status == "FAILED" && event.headers['x-retry'] === 'true') {
                
                    let id = uuidv4();
                    console.log("Auto Generate ID : ",id);
                    
                    //Get ObjectID
                     const GetDBData =await getDBData(TableID);
                     console.log("getObjectID :", GetDBData);
                     
                     let getData = unmarshall(GetDBData);
                     console.log("getData",getData );     
                    
                    
                    let createdPaymentdetails = await createPaymentDetails(getData,id);
                    console.log("Response of CreatePaymentHistory : ", createdPaymentdetails);
                 
                    // Parse CurrencyDecimalDigit as an integer
                    const decimalDigits = Number(getData.CurrencyDecimalDigit);
                    console.log("decimalDigits",decimalDigits);
                    // Calculate the factor by raising 10 to the power of decimalDigits
                    const factor = Math.pow(10, decimalDigits);
                    console.log("factor",factor);
                    const multipliedAmount = getData.Amount * factor;
                    console.log("multipliedAmount",multipliedAmount);
                    
                    // Calculate the HMAC
                    let calculatedHMAC =await generateHMAC(createdPaymentdetails,merchantID,multipliedAmount, getData.Currency,HMacPassword);
                    console.log("calculatedHMAC :", calculatedHMAC);
                     
                    let dataToEncrypt = `MerchantID=${merchantID}&TransID=${createdPaymentdetails}&Currency=${getData.Currency}&Amount=${multipliedAmount}&MAC=${calculatedHMAC}&URLNotify=${notifyURL}&URLSuccess=${getData.SuccessURL}&URLFailure=${getData.FailureURL}`;
                    console.log("dataToEncrypt :", dataToEncrypt);
                    // Encrypt the string
                    let EncryptedString  = await  BlowfishEncryption(dataToEncrypt, blowfishKey,);
                    console.log("EncryptedString for Response :",EncryptedString);
                    
                
                     let returnData ={
                      TransID: id,      
                      Amount: getData.Amount,
                      Currency:getData.Currency,
                      ClientName:getData.ClientName,  
                      PhoneNumber:getData.PhoneNumber,
                      City:getData.City,
                      Country:getData.Country,
                      InvoiceNumbers: getData.InvoiceNumbers,
                      State:getData.State,
                      PostalCode:getData.PostalCode,
                      AddressLine1:getData.AddressLine1,
                      FirstName:getData.FirstName, 
                      LastName:getData.LastName,
                      EncryptedString: EncryptedString,
                      Length: EncryptedString.length,
                      MerchantID: merchantID,
                     };
                          return {
                                statusCode: 200,
                                headers: {
                                        "Access-Control-Allow-Headers" : "*",
                                        "Access-Control-Allow-Origin": "http://localhost:3000",
                                        // "Access-Control-Allow-Origin": "https://development.d389b8rydflvtl.amplifyapp.com",
                                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                                         },
                                    body: JSON.stringify(returnData),
                                 };
               
            }else{
            console.log("Error : '⚠️HMAC validation failed' ");
            return {
                statusCode: 403,
                headers: {
                        "Access-Control-Allow-Headers" : "Content-Type",
                        "Access-Control-Allow-Origin": "http://localhost:3000",
                        // "Access-Control-Allow-Origin": "https://development.d389b8rydflvtl.amplifyapp.com",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                      },
                body: JSON.stringify({ success: false, message: '⚠️HMAC validation failed' }),
            };
            }
         }   
         
     
    }catch (error) {
        console.error("Error get db details:", error);
        throw error;
    }

        async function getDBData(TransID) {
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
    
        async function RetrygenerateHMAC(PayID,transID, merchantID, Status, code, hmacPassword){
            const message = `${PayID}*${transID}*${merchantID}*${Status}*${code}`;
            // console.log("Message", message, "secretKey", hmacPassword);

            const hash = HmacSHA256(message, hmacPassword);
            const hashInHex = hash.toString(enc.Hex);
            // console.log("hashInHex---", hashInHex);
        
        return hashInHex.toUpperCase();
  }
        
        async function createPaymentDetails(paymentDetails,id){ 
             
            try{ 
                
                    // Create a new Date object with the provided date
                    var currentDate = new Date();
                    
                    // Current date with time
                    var Currenttime =
                      currentDate.getFullYear() +
                      "-" +
                      ((currentDate.getMonth() + 1) < 10 ? "0" : "") +
                      (currentDate.getMonth() + 1) +
                      "-" +
                      (currentDate.getDate() < 10 ? "0" : "") +
                      currentDate.getDate() +
                      " " +
                      (currentDate.getHours() < 10 ? "0" : "") +
                      currentDate.getHours() +
                      ":" +
                      (currentDate.getMinutes() < 10 ? "0" : "") +
                      currentDate.getMinutes() +
                      ":" +
                      (currentDate.getSeconds() < 10 ? "0" : "") +
                      currentDate.getSeconds();
                    
                    console.log("Today with time: ", Currenttime);
          
          
                console.log("paymentDetails.InvoiceNumbers :", paymentDetails.InvoiceNumbers);

                // Convert the object into an array of objects suitable for DynamoDB
                const invoices = Object.entries(paymentDetails.InvoiceNumbers).map(([key, value]) => ({
                    [key]: { S: value }
                }));
                
                console.log("Given Invoice Details array : ", invoices);
             
                
                    let createdDynamoDBData = await client.send(
                            new PutItemCommand({
                                TableName: PaymentDetailsTableName,
                                Item:{
                                  id: { S : id},
                                  FirstName : { S:paymentDetails.FirstName },
                                  LastName :  { S:paymentDetails.LastName },
                                  CompanyName : { S:paymentDetails.CompanyName },
                                  Email :  { S:paymentDetails.Email },
                                  AddressLine1 :  { S:paymentDetails.AddressLine1 },
                                  AddressLine2 :  { S:paymentDetails.AddressLine2 },
                                  Country :  { S:paymentDetails.Country },
                                  State :  { S:paymentDetails.State },
                                  City :  { S:paymentDetails.City },
                                  PostalCode :  { S:paymentDetails.PostalCode},
                                  PhoneNumber :  { S:paymentDetails.PhoneNumber },
                                  Amount :  { S:paymentDetails.Amount },
                                  Currency :  { S:paymentDetails.Currency },
                                  PaymentStatus :  { S: paymentDetails.PaymentStatus},
                                  InvoiceNumbers: { M: Object.assign({}, ...invoices) }, 
                                  SuccessURL :  { S:paymentDetails.SuccessURL },
                                  FailureURL :  { S:paymentDetails.FailureURL },
                                  CurrencyDecimalDigit : { S:(paymentDetails.CurrencyDecimalDigit).toString() },
                                  BeforePaymentSAPstatus:{ S:"" },
                                  AfterPaymentSAPstatus: { S:"" }, 
                                  SAPErrorMessage:{ S:"" },
                                  SAPObjectID:{ S:"" },
                                  Description:{ S:"" },
                                  PaymentMailStatus:{ S:"" },
                                  PaymentId:{ S:""},
                                  SAPMailStatus:{ S:""},
                                  createdAt:{ S:Currenttime},
                                  ClientName:{ S:paymentDetails.ClientName},
                                  ClientCompanyID:{ S:paymentDetails.ClientCompanyID}
                    
                  }})
                  );
                  
                  console.log("After Created Response ID : ",id);
        
                    return id;
                    }
                catch(err){
                    console.error("Create a PaymentDetails in Dynamodb : ",err);
                    return err;
                }
            }
            
        async function generateHMAC(id, merchantID, Amount, Currency, hmacPassword){
                    const message = `*${id}*${merchantID}*${Amount}*${Currency}`;
                    // console.log("Message", message, "secretKey", hmacPassword);
                    const hash = HmacSHA256(message, hmacPassword);
                    const hashInHex = hash.toString(enc.Hex);
                    // console.log("hashInHex---", hashInHex);
                
                return hashInHex.toUpperCase();
          }
         
        async function BlowfishEncryption(dataToEncrypt, blowfishKey) {
           
            let plainString = dataToEncrypt;
            console.log("INSIDE BLOWFISH Function : ", plainString, "blowfishKey", blowfishKey);
        
            const bf = new Blowfish(blowfishKey, 0, 3);
            // bf.setIv('00000000');
            // Encryption
            const encoded = bf.encode(plainString);
            const encodedText = Buffer.from(encoded).toString('hex').toUpperCase();
            // console.log("ENCODED TEXT", encodedText);
        
            const newhex = Uint8Array.from(Buffer.from(encodedText, 'hex'));
            const decoded = bf.decode(newhex, Blowfish.TYPE.STRING);
            // console.log("DECODED TEXT", decoded);
        
            return encodedText;
        } 
};



