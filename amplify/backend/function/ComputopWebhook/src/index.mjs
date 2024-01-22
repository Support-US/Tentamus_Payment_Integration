import AWS from 'aws-sdk';
import crypto from 'crypto';
import { DynamoDBClient, UpdateItemCommand  } from "@aws-sdk/client-dynamodb";
import axios from 'axios';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const secretsManager = new AWS.SecretsManager();
    const Secretdata = await secretsManager.getSecretValue({ SecretId: hmacPassword }).promise();
    const secretData = JSON.parse(Secretdata.SecretString);
     console.log('Secret value:', secretData.SAPHostName);   
    
const client = new DynamoDBClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-hhy6rqmttfa5xp6e4jv5ctvjsi-dev`;
const hmacPassword = 'YOUR_HMAC_PASSWORD';

export const handler = async (event) => {
    try {
        const { body } = event;
        const { payID, transID, merchantID, status, code, receivedMAC } = JSON.parse(body);
        const expectedMAC = calculateHMAC({ payID, transID, merchantID, status, code }, hmacPassword);
       
        let Responsedata = event;
        if (receivedMAC === expectedMAC) {
            let JsonData = unmarshall(Responsedata);
                    console.log(`EVENT Marshal : ${JSON.stringify(JsonData)}`);
            let postData ={
                PaymentId: JsonData.PaymentId,
                Status: JsonData.Status,
            };
            console.log("Postdata:", JSON.stringify(postData));
                const postdata = JSON.stringify(postData);
                const response = await axios.post(`https://my351609.sapbydesign.com/sap/byd/odata/cust/v1/payment_advice/PaymentAdviceRootCollection`, postdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic X1BBWU1FTlRfQURWOldlbGNvbWUx'
                    },
                });
    
                console.log("API RESPONSE For CREATE PaymentDetails ---->", response.status);
                console.log("Response :", JSON.stringify(response.data.d.results));
                const responseData = response.data.d.results;
                  if (response.status === 201) {
                        const updatedResponse = await UpdatePaymentDetailsID(responseData, JsonData.PaymentId);
                        console.log("updatedResponse :", updatedResponse);
                        
                        return {
                            statusCode: 200,  
                            body: updatedResponse,
                        };
            }
            
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'HMAC validation successful' }),
            };
        } else {
            console.error('HMAC validation failed');
            return {
                statusCode: 403,
                body: JSON.stringify({ success: false, message: 'HMAC validation failed' }),
            };
        }
    } catch (error) {
        console.error('Error processing response:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal server error' }),
        };
    }

function calculateHMAC(responseData, hmacPassword) {
    const hmac = crypto.createHmac('sha256', hmacPassword);
    const responseDataContent = `${responseData.payID || ''}*${responseData.transID}*${responseData.merchantID}*${responseData.status || ''}*${responseData.code || ''}`;
    hmac.update(responseDataContent);
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