import AWS from 'aws-sdk';
import { Blowfish } from 'egoroof-blowfish';
import { Buffer } from 'buffer';
import { DynamoDBClient, QueryCommand, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';

import axios from 'axios';
import pkg from 'crypto-js';
const { HmacSHA256, enc } = pkg;
const client = new DynamoDBClient({ region: process.env.REGION });
const secretsManager = new AWS.SecretsManager();
const data = await secretsManager.getSecretValue({ SecretId: `Tentamus_Payment_Integration` }).promise();
let HMacPassword, blowfishKey, merchantID;
const secretValue = JSON.parse(data.SecretString);
console.log("secretValue : ", secretValue);
const PaymentDetailsTableName = secretValue.DBTable;

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const sesClient = new SESClient({ region: process.env.REGION });

export const handler = async (event) => {
    console.log(`Request EVENT: ${JSON.stringify(event)}`);

    try {
        if (event.queryStringParameters.q == secretValue.CFLCompanyName) {
            HMacPassword = secretValue['Columbia Laboratories HMacPassword'];
            blowfishKey = secretValue['Columbia Laboratories blowfishKey'];
            merchantID = secretValue['Columbia Laboratories MerchantID'];
        }
        else if (event.queryStringParameters.q == secretValue.TNAVCompanyName) {
            HMacPassword = secretValue['Tentamus North America Virginia HMacPassword'];
            blowfishKey = secretValue['Tentamus North America Virginia blowfishKey'];
            merchantID = secretValue['Tentamus North America Virginia MerchantID'];
        }
        else if (event.queryStringParameters.q == secretValue.AALCompanyName) {
            HMacPassword = secretValue['Adamson Analytical Labs HMacPassword'];
            blowfishKey = secretValue['Adamson Analytical Labs blowfishKey'];
            merchantID = secretValue['Adamson Analytical Labs MerchantID'];
        }
        else {
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
        const decryptedString = await BlowfishDecryption(base64EncodedString, blowfishKey);

        // Parse the URL-encoded string into an object
        const parsedObject = await parseUrlEncodedString(decryptedString);
        console.log("parsedObject :", parsedObject);

        // Calculate the HMAC
        const calculatedHMAC = await generateHMAC(parsedObject.PayID, parsedObject.TransID, merchantID, parsedObject.Status, parsedObject.Code, HMacPassword);
        console.log("calculatedHMAC :", calculatedHMAC);

        const Hmac = parsedObject.MAC;
        console.log("Hmac :", Hmac);


        //Get ObjectID
        const getObjectID = await GetObjectid(parsedObject.refnr);
        console.log("getObjectID :", getObjectID);

        if (Hmac.trim() === calculatedHMAC.trim()) {

            let SendMail = await sendPaymentEmail(parsedObject, getObjectID);
            console.log("SendMail response :", SendMail);

            let response = await CreateData(parsedObject, getObjectID);
            console.log("response :", response);

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'Request processed successfully' }),
            };
        }
        else {
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

    async function BlowfishDecryption(base64EncodedText, key) {
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

    async function generateHMAC(PayID, transID, merchantID, Status, code, hmacPassword) {
        const message = `${PayID}*${transID}*${merchantID}*${Status}*${code}`;
        // console.log("Message", message, "secretKey", hmacPassword);

        const hash = HmacSHA256(message, hmacPassword);
        const hashInHex = hash.toString(enc.Hex);
        // console.log("hashInHex---", hashInHex);

        return hashInHex.toUpperCase();
    }

    async function GetObjectid(TransID) {
        console.log("TransID :", TransID);
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

    async function sendPaymentEmail(paymentDetails, getObjectID) {
        const getDBData = unmarshall(getObjectID);
        console.log('getDBData', getDBData);


        const now = getPSTTime();
        console.log(now);


        const InvoiceNumbers = getDBData.InvoiceNumbers;
        const invoiceNumbersString = Object.values(InvoiceNumbers).join(',');
        console.log(invoiceNumbersString);

        try {
            const isPaymentSuccess = paymentDetails.Status === 'OK';
            const statusText = isPaymentSuccess ? 'SUCCESS' : 'FAILED';
            const statusColor = isPaymentSuccess ? '#4caf50' : '#d32f2f'; // Green for success, red for failure
            // const title = isPaymentSuccess ? 'Payment Confirmation Receipt' : 'Payment Transaction Failed';
            const title = `${getDBData.ClientName} Payment Confirmation`;
            const PaymentStatus = isPaymentSuccess ? 'Payment successful' : 'Payment failed';
            const lastFourDigits = paymentDetails.PCNr.slice(-4);
            const maskedpan = paymentDetails.maskedpan.slice(-4);

            const params = {
                Destination: { ToAddresses: [getDBData.Email] },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>${title}</title>
</head>
<body style="margin: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;">

    <!-- Container -->
    <div style="max-width: 800px; margin: 30px auto; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 8px;">

        <!-- Header -->
        <div style="background-color: #007640; text-align: center; padding: 20px 0; color: #ffffff; border-radius: 8px 8px 0 0;">  
            <h2 style="margin: 0;font-size: 32px;">${getDBData.ClientName}</h2>
        </div>

        <!-- Payment Status -->
        <div style="text-align: center; padding: 20px;">
            <h2 style="margin: 10px 0; font-size: 24px; color: #1f2d3d;">Amount:$${getDBData.Amount}     ${getDBData.Currency}</h2>  
            <p style="margin: 0; color: ${statusColor}; font-size: 20px;">${statusText}</p>
        </div>

<hr/>


        <!-- Payment Details -->
        <div style="margin-left:5rem; padding: 20px;"> 
            <div style="margin-bottom: 10px;">
                <strong style="display: inline-block; width: 150px;">Payment Id:</strong>  
                <span>${paymentDetails.PayID}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong style="display: inline-block; width: 150px;">Payment Status:</strong>
                <span>${PaymentStatus}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong style="display: inline-block; width: 150px;">Payment Date & Time:</strong>
                <span>${now} Pacific Standard Time (PST)</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong style="display: inline-block; width: 150px;">Payment Method:</strong>
                <span>${paymentDetails.CCBrand} xxxxxxxxxxxx${maskedpan}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong style="display: inline-block; width: 150px;">Name:</strong>
                <span>${[getDBData.FirstName, getDBData.LastName].filter(Boolean).join(' ')}</span>
            </div>
            <div>
                <strong style="display: inline-block; width: 150px;">Invoice:</strong>
                <span>${invoiceNumbersString}</span> 
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 15px; border-top: 1px solid #ddd; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
                If you have any questions or concerns, please reach out to us at 
                <a href="mailto:AccountsReceivable.CFL@tentamus.com" style="color: #1a73e8; text-decoration: none;">
                    AccountsReceivable.CFL@tentamus.com
                </a>.
            </p>
        </div>

    </div>

</body>
</html>
                        `,
                        },
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: title,
                    },
                },
                Source: 'noreply-awssupport@nipurnait.com', // Replace with your verified SES email
                // Source: 'AccountsReceivable.CFL@tentamus.com', // Replace with your verified SES email
            };

            // Send the email using SES
            console.log('Sending email with params:', params);
            const response = await sesClient.send(new SendEmailCommand(params));
            console.log('Email sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async function CreateData(parsedObject, getObjectID) {

        try {
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
                    const updatedResponse = await UpdatePaymentDetailsID(parsedObject, getDBData);
                    console.log("updatedResponse :", updatedResponse);
                    return {
                        statusCode: 204,
                        body: updatedResponse,
                    };
                } else {
                    const UpdateFailureStatus = await UpdateFailurestatus(responseData, parsedObject, "");
                    console.log("UpdateFailurestatus :", UpdateFailureStatus);

                    return {
                        statusCode: response.status,
                        body: JSON.stringify({ error: "SAP server is down" }),
                    };
                }
            } catch (err) {
                console.error("ERROR:", err);

                const UpdateFailureStatus = await UpdateFailurestatus(err, parsedObject, "ServerError");
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

    async function UpdatePaymentDetailsID(parsedObject, getDBData) {
        if (!PaymentDetailsTableName) {
            console.error("🚨 Error: PaymentDetailsTableName is not set.");
            throw new Error("PaymentDetailsTableName is required but is undefined or null.");
        }

        const params = {
            TableName: PaymentDetailsTableName,
            Key: {
                id: { S: parsedObject.refnr },
            },
            UpdateExpression: "SET PaymentId = :newPaymentId, PaymentStatus = :newStatus, AfterPaymentSAPstatus = :newStatusMessage, Description = :newDescription",
            ExpressionAttributeValues: {
                ":newPaymentId": { S: parsedObject.PayID },
                ":newStatus": { S: parsedObject.Status === 'OK' ? 'Success' : 'Failed' },
                ":newStatusMessage": { S: "Success" },
                ":newDescription": { S: parsedObject.Description }
            },
            ReturnValues: "ALL_NEW",
        };

        if (parsedObject.prefill === "on") {
            console.log("prefill is on");

            try {
                const existingCardQuery = new QueryCommand({
                    TableName: PaymentDetailsTableName, // ✅ Ensure this is not null
                    IndexName: "UserByEmail",
                    KeyConditionExpression: "Email = :email",
                    ExpressionAttributeValues: {
                        ":email": { S: getDBData.Email }
                    }
                });

                // console.log("Querying existing card details with params:", JSON.stringify(existingCardQuery.input, null, 2));

                const existingCardResult = await client.send(existingCardQuery);
                // console.log("Existing Card Query Result:", JSON.stringify(existingCardResult, null, 2));

                const existingCardDetailsList = existingCardResult.Items
                    .filter(item => item.CardDetails)
                    .map(item => JSON.parse(item.CardDetails.S));

                const existingCard = existingCardDetailsList.length > 0 ? existingCardDetailsList[0] : null;
                console.log("Existing Card Details:", existingCard);

                if (!existingCard) {
                    let newCardDetails = JSON.stringify({
                        cardholderName: parsedObject.TransID,
                        number: parsedObject.PCNr,
                        maskedpan: parsedObject.maskedpan,
                        expiryDate: parsedObject.CCExpiry,
                        brand: parsedObject.CCBrand
                    });

                    params.UpdateExpression += ", CardDetails = :newCardDetails";
                    params.ExpressionAttributeValues[":newCardDetails"] = { S: newCardDetails };
                } else {
                    console.log("Card details already exist for this email. Skipping update.");
                }
            } catch (queryError) {
                console.error("Error querying existing card details:", queryError);
            }
        }

        try {
            const command = new UpdateItemCommand(params);
            const DBResponse = await client.send(command);
            console.log("DBResponse:", JSON.stringify(DBResponse, null, 2));
            return DBResponse;
        } catch (updateError) {
            console.error("Error updating payment details:", updateError);
            throw updateError;
        }
    }

    async function UpdateFailurestatus(error, parsedObject, errStatus) {
        let params;
        if (errStatus == "") {
            params = {
                TableName: PaymentDetailsTableName,
                Key: {
                    id: { S: parsedObject.refnr },
                },
                UpdateExpression: "SET PaymentStatus = :newStatus, AfterPaymentSAPstatus = :newStatusMessage,SAPErrorMessage = :newErrorMessage",
                ExpressionAttributeValues: {
                    ":newStatus": { S: parsedObject.Status === 'OK' ? 'Success' : 'Failed' },
                    ":newStatusMessage": { S: "Failed" },
                    ":newErrorMessage": { M: { "ErrorMessage": { S: error.message } } },
                },
                ReturnValues: "ALL_NEW",
            };
        }
        else {
            params = {
                TableName: PaymentDetailsTableName,
                Key: {
                    id: { S: parsedObject.refnr },
                },
                UpdateExpression: "SET PaymentStatus = :newStatus, AfterPaymentSAPstatus = :newStatusMessage,SAPErrorMessage = :newErrorMessage",
                ExpressionAttributeValues: {
                    ":newStatus": { S: parsedObject.Status === 'OK' ? 'Success' : 'Failed' },
                    ":newStatusMessage": { S: "Failed" },
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

    function getPSTTime() {
        // Get the current date and time in UTC
        const currentUTCDate = new Date();

        // Convert the current UTC date to Pacific Standard Time
        const options = {
            timeZone: 'America/Los_Angeles', // Set to PST
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // Use 12-hour format
        };

        // Format the date dynamically to PST
        return new Intl.DateTimeFormat('en-US', options).format(currentUTCDate);
    }

};




