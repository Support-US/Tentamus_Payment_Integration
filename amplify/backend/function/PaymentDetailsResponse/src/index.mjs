import AWS from 'aws-sdk';
import axios from 'axios';
import { unmarshall } from '@aws-sdk/util-dynamodb';
const secretsManager = new AWS.SecretsManager();

export const handler = async (event) => {
        console.log(`EVENT: ${JSON.stringify(event)}`);
        const data = await secretsManager.getSecretValue({ SecretId:`Tentamus_Payment_Integration`}).promise();
        const secretValue = data.SecretString;

    try {
        if (event.Records && event.Records.length > 0) {
            // Assuming the first record in the array contains the data
            let DynamoDBdata = event.Records[0].dynamodb.NewImage;
            if(event.Records[0].eventName === "INSERT"){
                if (DynamoDBdata) {
                    let JsonDBData = unmarshall(DynamoDBdata);
                    console.log(`EVENT Marshal : ${JSON.stringify(JsonDBData)}`);
                                    
                    let postData = {
                    // PaymentID: "",
                    Email: JsonDBData.Email,
                    FirstName: JsonDBData.FirstName,
                    LastName: JsonDBData.LastName,
                    CompanyName: JsonDBData.CompanyName,
                    Address1: JsonDBData.AddressLine1,
                    Address2: JsonDBData.AddressLine2,
                    PhoneNo: JsonDBData.PhoneNumber,
                    Country: JsonDBData.Country,
                    State_Region: JsonDBData.State,
                    City: JsonDBData.City,
                    Status: JsonDBData.Status,
                    currencyCode: JsonDBData.Currency,
                    Amount: JsonDBData.Amount,
                    TransactionID: JsonDBData.id,
                    Zip_PostalCode: JsonDBData.PostalCode,
                    ZPaymentAdviceItem:JsonDBData.InvoiceNumbers
                };
                console.log("Postdata:", JSON.stringify(postData));
                const postdata = JSON.stringify(postData);
                const response = await axios.post(`https://my351609.sapbydesign.com/sap/byd/odata/cust/v1/payment_advice/ZPaymentAdviceRootCollection`, postdata, {
                    headers: {
                            
                            'Content-Type': 'application/json', 
                             Authorization: "Basic " + new Buffer.from(`${JSON.parse(secretValue).OdataUsername}` + ":" + `${JSON.parse(secretValue).OdataPassword}`).toString("base64")
 
                    },
                });
                
                console.log("API RESPONSE For CREATE PaymentDetails ---->", response.status);
                console.log("Response :", JSON.stringify(response.data.d.results));
                
                } else {
                    console.error("NewImage is undefined or empty in DynamoDB event.");
                    return {
                        statusCode: 400,
                        body: JSON.stringify('NewImage is undefined or empty in DynamoDB event.'),
                    };
                }
            }
            else {
                    console.error(`${event.Records[0].eventName} Data in DynamoDB event.`);
                    return {
                        statusCode: 400,
                        body: JSON.stringify(`${event.Records[0].eventName} Data in DynamoDB event.`),
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

};

    