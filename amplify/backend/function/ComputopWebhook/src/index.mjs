// import AWS from 'aws-sdk';
// import { Blowfish } from 'egoroof-blowfish';
// import { Buffer } from 'buffer';
// import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
// import axios from 'axios';
// import crypto from 'crypto';

// const secretsManager = new AWS.SecretsManager();
// const client = new DynamoDBClient({ region: process.env.REGION });
// const PaymentDetailsTableName = `PaymentDetails-hhy6rqmttfa5xp6e4jv5ctvjsi-dev`;

// // Blowfish decryption function
// const BlowfishDecryption = (base64EncodedText, key) => {
// const bf = new Blowfish(key, 0, 3);

// // Convert the Base64-encoded string to a Buffer
// const encodedBuffer = Buffer.from(base64EncodedText, 'base64');

// // Convert the hex string to a Buffer
// const hexString = encodedBuffer.toString('hex');
// const decodedBuffer = Buffer.from(hexString, 'hex');

// // Decryption
// const decodedText = bf.decode(decodedBuffer).toString('utf-8');

// return decodedText;
// };

// export const handler = async (event) => {
//             console.log(`Request EVENT: ${JSON.stringify(event)}`);
//             const data = await secretsManager.getSecretValue({SecretId: `Tentamus_Payment_Integration`}).promise(); 
//             const secretValue = JSON.parse(data.SecretString);
//             const HMacPassword = secretValue.HMacPassword;
//             const blowfishKey = secretValue.blowfishKey;
//             const merchantID  = secretValue.MerchantID;
            
//             // console.log('Secret value:', data);  
    
//     try {
        
//         const { encryptedString } = event;
        
//          // Base64 encode the encrypted text before sending it to AWS Lambda
//         // const base64EncodedString = Buffer.from(encryptedString, 'hex').toString('base64');

//         // Decrypt the string
//         const decryptedString = BlowfishDecryption(encryptedString, blowfishKey);

//         // Parse the URL-encoded string into an object
//         const parsedObject = parseUrlEncodedString(decryptedString);

//         // Perform HMAC authentication
//         const expectedHMAC = calculateHMAC(parsedObject.TransID,parsedObject.Currency, parsedObject.Amount,merchantID,HMacPassword);
//         const Hmac = parsedObject.MAC;
//         if (Hmac !== expectedHMAC) {
//             let response = await CreateData(parsedObject);
//                       console.log("response :",response); 
//                       return response;
//                   }
                 
//             return {
//                 statusCode: 403,
//                 body: JSON.stringify({ success: false, message: '⚠️HMAC validation failed' }),
//             };
        
//     } catch (error) {
//         console.error('Error:', error);

//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Internal Server Error' }),
//         };
        
//     }

// async function parseUrlEncodedString(urlEncodedString) {
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

// async function calculateHMAC(transID, merchantID, status, code, hmacPassword) {
//     // Concatenate parameters with asterisks
//     const dataToHash = `*${transID}*${merchantID}*${status}*${code}`;

//     // Create HMAC SHA-256 object with the password
//     const hmac = crypto.createHmac('sha256', hmacPassword);

//     // Update HMAC object with the data to hash
//     hmac.update(dataToHash);

// // Get the final HMAC value in hex format
//     const calculatedHMAC = hmac.digest('hex');
//     return calculatedHMAC;

// }

// async function CreateData(parsedObject){

//     try{
//     let postData = {
//             PaymentID: parsedObject.PaymentId,
//             Status: parsedObject.Status,
//         };

//         console.log("Postdata:", JSON.stringify(postData));

//         try {

//             // Send data to SAP API
//             const response = await axios.patch(
//               `${(secretValue).SAPHostName}/sap/byd/odata/cust/v1/payment_advice/ZPaymentAdviceRootCollection('EBBA7411308F1EEEAE9F005CB053A5B4')`,
//                 postData,
//                 {
//                     headers: {
                        
//                         'Content-Type': 'application/json',
                       
//                         Authorization: "Basic " + Buffer.from(`${secretValue.OdataUsername}:${secretValue.OdataPassword}`).toString("base64"),
//                     },
//                 }
//             );

//             console.log("API RESPONSE For CREATE PaymentDetails ---->", response.status);
//             console.log("Response Body:", JSON.stringify(response.data));
//              const responseData = response.results;
//             if (response.status === 204) {
//                 const updatedResponse = await UpdatePaymentDetailsID(parsedObject.PaymentId);
//                 console.log("updatedResponse :", updatedResponse);
//                 return {
//                     statusCode: 200,
//                     body: updatedResponse,
//                 };
//             } else {
//                 const UpdateFailureStatus = await UpdateFailurestatus(responseData,parsedObject.PaymentId,"");
//                 console.log("UpdateFailurestatus :", UpdateFailureStatus);
                    
//                 return {
//                     statusCode: response.status,
//                     body: JSON.stringify({ error: "SAP server is down" }),
//                 };
//             } 
//         } catch (err) {
//             console.error("ERROR:", err);
//             const UpdateFailureStatus = await UpdateFailurestatus(err,parsedObject.PaymentId,"ServerError");
//             console.log("UpdateFailurestatus :", UpdateFailureStatus);
//             return {
//                 statusCode: err.statusCode,
//                 body: JSON.stringify({ error: err.message }),
//             };
//         }
//     } catch (error) {
//         console.error("Error parsing event:", error);
//         return {
//             statusCode: 400,
//             body: JSON.stringify({ error: "Bad Request" }),
//         };
//     }
// }

// async function UpdatePaymentDetailsID( id) {
//     const params = {
//         TableName: PaymentDetailsTableName,
//         Key: {
//             id: { S: id },
//         },
//         UpdateExpression: "SET PaymentId = :newPaymentId, #statusAttr = :newStatus",
//         ExpressionAttributeValues: {
//             ":newPaymentId": { S: parsedObject.PaymentId },
//             ":newStatus": { S: "Success" }, 
//         },
//          ExpressionAttributeNames: {
//         "#statusAttr": "Status", 
//     },
//         ReturnValues: "ALL_NEW",
//     };

//     const command = new UpdateItemCommand(params);
//     const DBResponse = await client.send(command);  
//     console.log("DBResponse :", DBResponse);
//     return DBResponse;
// }

// async function UpdateFailurestatus(error,id,errStatus) {
//     let params
//     if(errStatus ==  ""){
//          params = {
//         TableName: PaymentDetailsTableName,
//         Key: {
//             id: { S: id },
//         },
//         UpdateExpression: "SET #statusAttr = :newStatus, StatusMessage = :newStatusMessage",
//         ExpressionAttributeValues: {
//             ":newStatus": { S: "Failed" },
//             ":newStatusMessage": { M: { "FailureStatusCode": { S: (error.status).toString() }, "ErrorMessage": { S: error.body } } },
//         },
//         ExpressionAttributeNames: {
//         "#statusAttr": "Status", 
//     },
//         ReturnValues: "ALL_NEW",
//     };
//     }
//     else{
//      params = {
//         TableName: PaymentDetailsTableName,
//         Key: {
//             id: { S: id },
//         },
//         UpdateExpression: "SET #statusAttr = :newStatus, StatusMessage = :newStatusMessage",
//         ExpressionAttributeValues: {
//             ":newStatus": { S: "Failed" },
//             ":newStatusMessage": { M: { "FailureStatusCode": { S: (error.response.status).toString() }, "ErrorMessage": { S: error.message } } },
//         },
//         ExpressionAttributeNames: {
//         "#statusAttr": "Status", 
//     },
//         ReturnValues: "ALL_NEW",
//     };
// }
//     const command = new UpdateItemCommand(params);

//     try {
//         const DBResponse = await client.send(command);
//         console.log("DBResponse :", DBResponse);
//         return DBResponse;
//     } catch (error) {
//         console.error("Error updating status:", error);
//         throw error;
//     }
// } 
// };


// ___________________________________________________________________________________________________________________________

// import crypto from 'crypto';

// export const handler = async (event) => {
//     try {
        
     
//         // const payID = '9484782'; 
//         const transID = '10cb9c29-db92-4126-9650-86d822f472a2'; 
//         const merchantID = 'Tentamus_Adamson_test'; 
//         const Currency = '22'; 
//         const Amount = 'USD'; 
//         const hmacPassword = 'K=p25W[iX_t6)7BrcR?8N!9dx3L(Ho*4'; 
        
//         // Calculate HMAC for the received data
//       const calculatedHMAC = calculateHMAC(transID, merchantID, Currency, Amount, hmacPassword).toUpperCase();
//         console.log("calculatedHMAC :", calculatedHMAC);
        
//         // Extract the expected HMAC from the event
//         const expectedHMAC = 'DB80471522D86C6FE15B6F83E3DD4A96EDC6E42C6193352499B0BC6E1D07FB66'; // Replace with actual property name containing the expected HMAC
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
//              console.error('HMAC validation failed');
                // const errorMessage = 'HMAC validation failed: Calculated HMAC does not match the expected HMAC';
                // throw new Error(errorMessage);
    // Alternatively, you can return an error response if needed:
    // return {
    //     statusCode: 403,
    //     body: JSON.stringify({ success: false, message: errorMessage }),
    // };
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Internal Server Error' }),
//         };
//     }


// // Function to calculate HMAC
// function calculateHMAC(transID, merchantID, Currency, Amount, hmacPassword) {
//     // Concatenate parameters with asterisks
//     const dataToHash = `*${transID}*${merchantID}*${Currency}*${Amount}`;
//     console.log("dataToHash",dataToHash);
//     // Create HMAC SHA-256 object with the password
//     const hmac = crypto.createHmac('sha256', hmacPassword);

//     // Update HMAC object with the data to hash
//     hmac.update(dataToHash);

//     // Get the final HMAC value in hex format
//     const calculatedHMAC = hmac.digest('hex');
//     return calculatedHMAC;
// }
// };


// -------------------------------------------------------------------------------------------------------------------
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
//         const encryptedString = '48e71e2d68a4971979bfff3c2fe75bedc9163be6a9538d0b397fb1ddb762ec6c36e917369ddd26019d74e48ff9b71d8502547ba1e76cbe2be462a7517de32d13f99a860e118bc9413c6efe01a44c702390726724545a3a59aeab97b0bbaf73bd649cd61fd5ea166fef0f40e9074bac93bef08fbe75278ff7af37fc0f0e29168b1427433c068eb9489d1ddbcb167ac159cd0aa3e0027cf43b52bc9bde293afa853181770fba0c72b88f83e4f52794b7959271852c747316105c1fc3f6f045a5e1082e1d3a7e12abe8ab01a6f612e6eeebfd97aa654ba0d8e77f512cb848f698068f8f94e861a968227def134d5d6125afc01b2652a9ed235533718b50a484cd33cabfd79fc2db94ba5fe60bd9d8c476c82893ba5daf0a07b344bee4ff9c70750314b5a0322a7685dbe1119eb2ee1b8cb75c146c1324641356'; // Replace with your actual key
//         const secretKey = 'Jd8=[Dt9s2A(3H?q'; // Replace with your actual secret key

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



// _______________________________________________________________________________________________________________________




// import AWS from 'aws-sdk';
// import axios from 'axios';
// // import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

// const secretsManager = new AWS.SecretsManager();
// // const client = new DynamoDBClient({ region: process.env.REGION });
// // const PaymentDetailsTableName = `PaymentDetails-hhy6rqmttfa5xp6e4jv5ctvjsi-dev`;
// // const data = await secretsManager.getSecretValue({SecretId: `Tentamus_Payment_Integration`}).promise();  const secretValue = JSON.parse(data.SecretString);

// export const handler = async (event) => {
//     try {
//         // Static values for testing
//         const parsedObject = {
//             PaymentID: "75676",
//             Status: "Success",
//         };

//         let postData = {
//             PaymentID: parsedObject.PaymentID,
//             Status: parsedObject.Status,
//         };

//         console.log("Postdata:", JSON.stringify(postData));

//         try {
//             // Retrieve SAP API credentials from AWS Secrets Manager
//             const data = await secretsManager.getSecretValue({ SecretId: `Tentamus_Payment_Integration` }).promise();
//             const secretValue = JSON.parse(data.SecretString);

//             // Send data to SAP API
//             const response = await axios.patch(
//               `${(secretValue).SAPHostName}/sap/byd/odata/cust/v1/payment_advice/ZPaymentAdviceRootCollection('EBBA7411308F1EEEAE9F005CB053A5B4')`,
//                 postData,
//                 {
//                     headers: {
                        
//                         'Content-Type': 'application/json',
                       
//                         Authorization: "Basic " + Buffer.from(`${secretValue.OdataUsername}:${secretValue.OdataPassword}`).toString("base64"),
//                     },
//                 }
//             );

//             console.log("API RESPONSE For CREATE PaymentDetails ---->", response.status);
//             console.log("Response Body:", JSON.stringify(response.data));

//     return {
//         statusCode: response.status,
//         body: JSON.stringify(response.data),
//     };
//         } catch (err) {
//             console.error("ERROR:", err);
//             return {
//                 statusCode: 500,
//                 body: JSON.stringify({ error: err.message }),
//             };
//         }
//     } catch (error) {
//         console.error("Error parsing event:", error);
//         return {
//             statusCode: 400,
//             body: JSON.stringify({ error: "Bad Request" }),
//         };
//     }
// };

// ______________________________________________________________________________________________________________

// import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

// const client = new DynamoDBClient({ region: process.env.REGION });
// const PaymentDetailsTableName = `PaymentDetails-hhy6rqmttfa5xp6e4jv5ctvjsi-dev`;

// export const handler = async (event) => {
//     try {
//         const updatedResponse = await UpdatePaymentDetailsID("292017b1-eb5f-49c3-8f94-a9ab99abb667","4562", "success");
//         console.log("updatedResponse :", updatedResponse);

//         return {
//             statusCode: 200,
//             body: JSON.stringify({ message: "Payment details updated successfully", updatedResponse }),
//         };
//     } catch (err) {
//         console.error("ERROR:", err);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: err.message }),
//         };
//     }
//   async function UpdatePaymentDetailsID(id, newPaymentId, newStatus) {
      
//     const params = {
//         TableName: PaymentDetailsTableName,
//         Key: {
//             id: { S: id },
//         },
//         UpdateExpression: "SET PaymentId = :newPaymentId, #s = :newStatus",
//         ExpressionAttributeValues: {
//             ":newPaymentId": { S: newPaymentId },
//             ":newStatus": { S: newStatus },
//         },
//         ExpressionAttributeNames: {
//             "#s": "Status",
//         },
//         ReturnValues: "ALL_NEW",
//     };

//     const command = new UpdateItemCommand(params);
//     const response = await client.send(command);
//     console.log("DynamoDB Response :", response);

//     return response;
// }


// };
// _________________________________________________________________________________________________


import AWS from 'aws-sdk';
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import axios from 'axios';
const secretsManager = new AWS.SecretsManager();
const client = new DynamoDBClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-hhy6rqmttfa5xp6e4jv5ctvjsi-dev`;

export const handler = async (event) => {
            console.log(`Request EVENT: ${JSON.stringify(event)}`);
            const data = await secretsManager.getSecretValue({SecretId: `Tentamus_Payment_Integration`}).promise(); 
            const secretValue = JSON.parse(data.SecretString);
            
            const parsedObject = {
                PaymentId: "5698",
                Status: "Success",
};
          try {
              let response = await CreateData(parsedObject);
                      console.log("response :",response); 
                      return response;
                  
                
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }          
              
async function CreateData(parsedObject){

    try{
    let postData = {
            PaymentID: parsedObject.PaymentId,
            Status: parsedObject.Status,
        };

        console.log("Postdata:", JSON.stringify(postData));

        try {

            // Send data to SAP API
            const response = await axios.patch(
              `${(secretValue).SAPHostName}/sap/byd/odata/cust/v1/payment_advice/ZPaymentAdviceRootCollection('EBBA7411308F1EEEAE9F005CB053A5B4')`,
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
                const updatedResponse = await UpdatePaymentDetailsID(parsedObject.PaymentId);
                console.log("updatedResponse :", updatedResponse);
                return {
                    statusCode: 200,
                    body: updatedResponse,
                };
            } else {
                const UpdateFailureStatus = await UpdateFailurestatus(responseData,parsedObject.PaymentId,"");
                console.log("UpdateFailurestatus :", UpdateFailureStatus);
                    
                return {
                    statusCode: response.status,
                    body: JSON.stringify({ error: "SAP server is down" }),
                };
            } 
        } catch (err) {
            console.error("ERROR:", err);
            const UpdateFailureStatus = await UpdateFailurestatus(err,parsedObject.PaymentId,"ServerError");
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

async function UpdatePaymentDetailsID( id) {
    const params = {
        TableName: PaymentDetailsTableName,
        Key: {
            id: { S: "afd5ef3f-5a6c-4049-9f71-79147e6f91fe" },
        },
        UpdateExpression: "SET PaymentId = :newPaymentId, #statusAttr = :newStatus",
        ExpressionAttributeValues: {
            ":newPaymentId": { S: parsedObject.PaymentId },
            ":newStatus": { S: "Success" }, 
        },
         ExpressionAttributeNames: {
        "#statusAttr": "Status", 
    },
        ReturnValues: "ALL_NEW",
    };

    const command = new UpdateItemCommand(params);
    const DBResponse = await client.send(command);  
    console.log("DBResponse :", DBResponse);
    return DBResponse;
}

async function UpdateFailurestatus(error,id,errStatus) {
    let params
    if(errStatus ==  ""){
         params = {
        TableName: PaymentDetailsTableName,
        Key: {
            id: { S: "afd5ef3f-5a6c-4049-9f71-79147e6f91fe" },
        },
        UpdateExpression: "SET #statusAttr = :newStatus, SAPUpdateStatusMessage = :newStatusMessage",
        ExpressionAttributeValues: {
            ":newStatus": { S: "Failed" },
            ":newStatusMessage": { M: { "FailureStatusCode": { S: (error.status).toString() }, "ErrorMessage": { S: error.body } } },
        },
        ExpressionAttributeNames: {
        "#statusAttr": "Status", 
    },
        ReturnValues: "ALL_NEW",
    };
    }
    else{
     params = {
        TableName: PaymentDetailsTableName,
        Key: {
            id: { S: id },
        },
        UpdateExpression: "SET #statusAttr = :newStatus, SAPUpdateStatusMessage = :newStatusMessage",
        ExpressionAttributeValues: {
            ":newStatus": { S: "Failed" },
            ":newStatusMessage": { M: { "FailureStatusCode": { S: (error.response.status).toString() }, "ErrorMessage": { S: error.message } } },
        },
        ExpressionAttributeNames: {
        "#statusAttr": "Status", 
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