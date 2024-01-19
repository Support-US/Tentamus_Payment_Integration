import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import axios from 'axios';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-hhy6rqmttfa5xp6e4jv5ctvjsi-dev`;

export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    try {
        if (event.Records && event.Records.length > 0) {
            // Assuming the first record in the array contains the data
            let DynamoDBdata = event.Records[0].dynamodb.NewImage;

            if (DynamoDBdata) {
                let JsonDBData = unmarshall(DynamoDBdata);
                console.log(`EVENT Marshal : ${JSON.stringify(JsonDBData)}`);

               
             let payment = JsonDBData.InvoiceNumbers[0];
             payment = payment.replace(/\\"/g, '"');
             payment = JSON.parse(payment);
              
                console.log("payment: ", payment);
                                // Example:
                let postData = {
                ID: JsonDBData.id,
                Email: JsonDBData.Email,
                FirstName: JsonDBData.FirstName,
                LastName: JsonDBData.LastName,
                Address1: JsonDBData.AddressLine1,
                Address2: JsonDBData.AddressLine2,
                PhoneNo: JsonDBData.PhoneNumber,
                Country: JsonDBData.Country,
                state: JsonDBData.State,
                City: JsonDBData.City,
                Status: JsonDBData.Status,
                currencyCode: JsonDBData.Currency,
                Amount: JsonDBData.Amount,
                TransactionID: JsonDBData.TransactionID,
                Zip: JsonDBData.PostalCode,
                PaymentAdviceItem: payment
            };

            console.log("Postdata:", JSON.stringify(postData));
            const postdata = JSON.stringify(postData);
            const response = await axios.post(`https://my351609.sapbydesign.com/sap/byd/odata/cust/v1/payment_advice/PaymentAdviceRootCollection`, postdata, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic X1BBWU1FTlRfQURWOldlbGNvbWUx'
                },
            });

            console.log("API RESPONSE For CREATE PaymentAdvice ---->", response.status);
            console.log("Response :", JSON.stringify(response.data.d.results));
            const responseData = response.data.d.results;
            
                if (response.status === 201) {
                    const updatedResponse = await UpdatePaymentDetailsID(responseData, JsonDBData.id);
                    console.log("updatedResponse :", updatedResponse);
                }
            } else {
                console.error("NewImage is undefined or empty in DynamoDB event.");
                return {
                    statusCode: 400,
                    body: JSON.stringify('NewImage is undefined or empty in DynamoDB event.'),
                };
            }
        } else {
            console.error("No Records found in the DynamoDB event.");
            return {
                statusCode: 400,
                body: JSON.stringify('No Records found in the DynamoDB event.'),
            };
        }
    } catch (err) {
        console.error("ERROR:", err);
        throw err;
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
     async function UpdatePaymentDetailsID(response, id) {
        const params = {
            TableName: PaymentDetailsTableName,
            Item: { 
                id: { S: id },
                PaymentId: { S: response.ObjectID },
            },
        };

        const command = new PutItemCommand(params);

        const DBResponse = await client.send(command);
        console.log("DBResponse :", DBResponse);
        return DBResponse;
    }

};

