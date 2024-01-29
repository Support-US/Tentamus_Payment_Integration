import AWS from 'aws-sdk';
import { Blowfish } from 'egoroof-blowfish';
import { Buffer } from 'buffer';
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import axios from 'axios';
import crypto from 'crypto';

const secretsManager = new AWS.SecretsManager();
const client = new DynamoDBClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-hhy6rqmttfa5xp6e4jv5ctvjsi-dev`;

 // Blowfish decryption function
const BlowfishDecryption = (base64EncodedText, key) => {
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
export const handler = async (event) => {
            console.log(`Request EVENT: ${JSON.stringify(event)}`);
            const data = await secretsManager.getSecretValue({SecretId: `Tentamus_Payment_Integration`}).promise(); 
            const secretValue = JSON.parse(data.SecretString);
            const HMacPassword = secretValue.HMacPassword;
            const blowfishKey = secretValue.blowfishKey;
            const merchantID  = secretValue.MerchantID;
            
            // console.log('Secret value:', data);  
    
    try {
        
        const { encryptedString, additionalEventData } = event;

        // Decrypt the string
        const decryptedString = BlowfishDecryption(encryptedString, blowfishKey);
        // Parse the URL-encoded string into an object
        const parsedObject = parseUrlEncodedString(decryptedString);

        // Perform HMAC authentication
        const expectedHMAC = calculateHMAC(parsedObject.Currency, parsedObject.Amount,merchantID,parsedObject.status, parsedObject.code, HMacPassword);
        const Hmac = parsedObject.mac;
        if (Hmac !== expectedHMAC) {
            let response = await CreateData(parsedObject);
                      console.log("response :",response); 
                      return response;
                  }
                 
            return {
                statusCode: 403,
                body: JSON.stringify({ success: false, message: 'HMAC validation failed' }),
            };
        
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
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

async function calculateHMAC(payID, transID, merchantID, status, code, hmacPassword) {
    // Concatenate parameters with asterisks
    const dataToHash = `${payID}*${transID}*${merchantID}*${status}*${code}`;

    // Create HMAC SHA-256 object with the password
    const hmac = crypto.createHmac('sha256', hmacPassword);

    // Update HMAC object with the data to hash
    hmac.update(dataToHash);

    // Get the final HMAC value in base64 format
const calculatedHMAC = hmac.digest('base64');
console.log('Calculated HMAC (base64):', calculatedHMAC);

    return calculatedHMAC;
}

async function CreateData(parsedObject){
    let postData ={
                    PaymentId: parsedObject.PaymentId,
                    Status: parsedObject.Status,
                };
                 console.log("Postdata:", JSON.stringify(postData));
                 const postdata = JSON.stringify(postData);
              try{ 
                  const response = await axios.post(`https://my351609.sapbydesign.com/sap/byd/odata/cust/v1/payment_advice/ZPaymentAdviceRootCollection('EBBA7411308F1EEEAE9F005CB053A5B4')`,postdata, {
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
    }
    catch (err) {
    console.error("ERROR:", err);
    return {
        statusCode: 500,
        body: err, 
    };  
    }
                 
}

async function UpdatePaymentDetailsID(response, id) {
    const params = {
        TableName: PaymentDetailsTableName,
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET PaymentId = :newPaymentId, Status = :newStatus",
        ExpressionAttributeValues: {
            ":newPaymentId": { S: response.ObjectID },
            ":newStatus": { S: "YourNewStatus" }, 
        },
        ReturnValues: "ALL_NEW",
    };

    const command = new UpdateItemCommand(params);
    const DBResponse = await client.send(command);  
    console.log("DBResponse :", DBResponse);
    return DBResponse;
}

};







// import crypto from 'crypto';

// export const handler = async (event) => {
//     try {
        
//         // Example data
//         const payID = '9484781'; // Replace with actual PayID
//         const transID = 'UniqueTransID'; // Replace with actual TransID
//         const merchantID = 'YourMerchantId'; // Replace with actual MerchantID
//         const status = '123'; // Replace with actual status
//         const code = 'EUR'; // Replace with actual code
//         const hmacPassword = 'test'; // Replace with actual HMAC password

//         // Calculate HMAC for the received data
//         const calculatedHMAC = calculateHMAC(payID, transID, merchantID, status, code, hmacPassword).toUpperCase();
//         console.log("calculatedHMAC :",calculatedHMAC);
//         // Extract the expected HMAC from the event
//         const expectedHMAC = 'PWBVdFRQqqaj7m+3S4FVlxAs/RI48irNdD3vaS4SSf8='; // Replace with actual property name containing the expected HMAC
//           console.log("expectedHMAC :",expectedHMAC);
          
//         // Validate HMAC
//         if (calculatedHMAC === expectedHMAC.toUpperCase()) {
//             console.log('HMAC validation successful');

//             // Continue with further processing or return success
//             return {
//                 statusCode: 200,
//                 body: JSON.stringify({ success: true, message: 'HMAC validation successful' }),
//             };
//         } else {
//             console.error('HMAC validation failed');
//             return {
//                 statusCode: 403,
//                 body: JSON.stringify({ success: false, message: 'HMAC validation failed' }),
//             };
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Internal Server Error' }),
//         };
//     }


// // Function to calculate HMAC
// function calculateHMAC(payID, transID, merchantID, status, code, hmacPassword) {
//     // Concatenate parameters with asterisks
//     const dataToHash = `${payID}*${transID}*${merchantID}*${status}*${code}`;

//     // Create HMAC SHA-256 object with the password
//     const hmac = crypto.createHmac('sha256', hmacPassword);

//     // Update HMAC object with the data to hash
//         hmac.update(dataToHash);
//     // Get the final HMAC value in base64 format
//          const calculatedHMAC = hmac.digest('base64');

//              return calculatedHMAC;
// }
// };




// import { Blowfish } from 'egoroof-blowfish';
// import { Buffer } from 'buffer';

// // Blowfish decryption function
// const BlowfishDecryption = (base64EncodedText, key) => {
//     console.log("ENCODED TEXT", base64EncodedText);

//     const bf = new Blowfish(key, 0, 3);

//     // Convert the Base64-encoded string to a Buffer
//     const encodedBuffer = Buffer.from(base64EncodedText, 'base64');

//     // Convert the hex string to a Buffer
//     const hexString = encodedBuffer.toString('hex');
//     const decodedBuffer = Buffer.from(hexString, 'hex');

//     // Decryption
//     const decodedText = bf.decode(decodedBuffer).toString('utf-8');
//     console.log("DECODED TEXT", decodedText);

//     return decodedText;
// };

// export const handler = async (event) => {
//     try {
//         // Retrieve encrypted string and secret key from the event or any other source
//         const encryptedString = '31e1eec0b227abe58da704c2e8c167b69f98e51d4a4e6178474e02c17a5893c5512c4c5a4f45602165b8a9e25429857591d05ef8b8d413f828d51243db3102e0f01b298811d8a775'; // Replace with your actual key
//         const secretKey = 'encrypt'; // Replace with your actual secret key

//         // Base64 encode the encrypted text before sending it to AWS Lambda
//         const base64EncodedString = Buffer.from(encryptedString, 'hex').toString('base64');

//         // Decrypt the string
//         const decryptedString = BlowfishDecryption(base64EncodedString, secretKey);

//         // Parse the URL-encoded string into an object
//         const parsedObject = parseUrlEncodedString(decryptedString);

//         return {
//             statusCode: 200,
//             body: JSON.stringify({ decryptedString, parsedObject }),
//         };
//     } catch (error) {
//         console.error('Error:', error);

//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Internal Server Error' }),
//         };
//     }

// // Function to parse URL-encoded string into an object
// function parseUrlEncodedString(urlEncodedString) {
//     if (urlEncodedString === undefined) {
//         return 'undefined';
//     }

//     try {
//         // Decoding the URL-encoded string with proper error handling
//         const decodedString = decodeURIComponent(urlEncodedString.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'));

//         const pairs = decodedString.split('&');
//         const result = {};

//         for (const pair of pairs) {
//             const [key, value] = pair.split('=');
//             result[key] = value;
//         }

//         return result;
//     } catch (error) {
//         console.error('Error decoding URL-encoded string:', error);
//         return 'error';
//     }
// }

// };