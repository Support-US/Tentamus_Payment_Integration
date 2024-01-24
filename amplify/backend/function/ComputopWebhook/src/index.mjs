import AWS from 'aws-sdk';
import { Blowfish } from 'egoroof-blowfish';
import { Buffer } from 'buffer';
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import axios from 'axios';
import crypto from 'crypto';

const secretsManager = new AWS.SecretsManager();
const client = new DynamoDBClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-hhy6rqmttfa5xp6e4jv5ctvjsi-dev`;

export const handler = async (event) => {
            console.log(`Request EVENT: ${JSON.stringify(event)}`);
            const data = await secretsManager.getSecretValue({SecretId: `Tentamus_Payment_Integration`}).promise(); 
            const secretValue = JSON.parse(data.SecretString);
            const HMacPassword = secretValue.HMacPassword;  
        // console.log('Secret value:', HMacPassword);  
    
    try {
        
        const { encryptedString, hmac, additionalEventData } = event; // Replace with actual event structure

        // Replace 'encrypt' with your actual secret key
        const blowfishKey = secretValue.blowfishKey;

        // Perform HMAC authentication
        const expectedHMAC = calculateHMAC(encryptedString, HMacPassword);

        if (hmac !== expectedHMAC) {
            
            // Decrypt the string
            const decryptedString = BlowfishDecryption(encryptedString, blowfishKey);
    
            // Parse the URL-encoded string into an object
            const parsedObject = parseUrlEncodedString(decryptedString);
    
            let postData ={
                    PaymentId: parsedObject.PaymentId,
                    Status: parsedObject.Status,
                };
                 console.log("Postdata:", JSON.stringify(postData));
                 const postdata = JSON.stringify(postData);
                
                const response = await axios.post(`https://my351609.sapbydesign.com/sap/byd/odata/cust/v1/payment_advice/PaymentAdviceRootCollection`,postdata, {
                    headers: {
                        'Content-Type': 'application/json', 
                        Authorization: "Basic " + new Buffer.from(`${JSON.parse(secretValue).OdataUsername}` + ":" + `${JSON.parse(secretValue).OdataPassword}`).toString("base64")
 
                    },
                });
    
                console.log("API RESPONSE For CREATE PaymentDetails ---->", response.status);
                console.log("Response :", JSON.stringify(response.data.d.results));
                const responseData = response.data.d.results;
                   if (response.status === 201) {
                        const updatedResponse = await UpdatePaymentDetailsID(responseData, parsedObject.PaymentId);
                        console.log("updatedResponse :", updatedResponse);
                        return {
                            statusCode: 200,  
                            body: updatedResponse,
                        };
                   }
                   console.error('HMAC validation failed');
            return {
                statusCode: 403,
                body: JSON.stringify({ success: false, message: 'HMAC validation failed' }),
            };
        }
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }

// Blowfish decryption function
module.exports.BlowfishDecryption = (base64EncodedText, key) => {
    const bf = new Blowfish(key, 0, 3);

    // Convert the Base64-encoded string to a Buffer
    const encodedBuffer = Buffer.from(base64EncodedText, 'base64');

    // Convert the hex string to a Buffer
    const hexString = encodedBuffer.toString('hex');
    const decodedBuffer = Buffer.from(hexString, 'hex');

    // Decryption
    const decodedText = bf.decode(decodedBuffer).toString('utf-8');

    return decodedText;
};

// Function to parse URL-encoded string into an object
function parseUrlEncodedString(urlEncodedString) {
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

function calculateHMAC(data, hmacPassword) {
    const hmac = crypto.createHmac('sha256', hmacPassword);
    hmac.update(data);
    return hmac.digest('hex');
}

async function UpdatePaymentDetailsID(response, id) {
    const params = {
        TableName: PaymentDetailsTableName,
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET PaymentId = :newPaymentId, #status = :newStatus",
        ExpressionAttributeValues: {
            ":newPaymentId": { S: response.ObjectID },
            ":newStatus": { S: "YourNewStatus" }, 
        },
        ExpressionAttributeNames: {
            "#status": "Status",
        },
        ReturnValues: "ALL_NEW",
    };

    const command = new UpdateItemCommand(params);
    const DBResponse = await client.send(command);  
    console.log("DBResponse :", DBResponse);
    return DBResponse;
}

};
