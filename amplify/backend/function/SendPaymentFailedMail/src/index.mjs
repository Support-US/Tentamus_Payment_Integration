import AWS from 'aws-sdk';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const sesClient = new SESClient({ region: process.env.REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const client = new DynamoDBClient({ region: process.env.REGION });

const secretsManager = new AWS.SecretsManager();
const data = await secretsManager.getSecretValue({SecretId: `Tentamus_Payment_Integration-Master`}).promise();
let AdminMail;
let ClientName;
const secretValue = JSON.parse(data.SecretString);
// console.log("secretValue : ", secretValue);   
const PaymentDetailsTableName = secretValue.DBTable;            

export const handler = async (event) => {
    console.log(`Request EVENT: ${JSON.stringify(event)}`);

    try {
        const paymentFailedDetails = await getPaymentFailedDetails();
        console.log("paymentFailedDetails : ", paymentFailedDetails); 
        if (paymentFailedDetails.length != 0) {
            try {
                 for (const details of paymentFailedDetails) {
        if (details.ClientCompanyID === secretValue.CFLCID) {
            AdminMail = secretValue['CFL Admin Mail'];
            ClientName = secretValue.CFLCompanyName;
        } else if (details.ClientCompanyID === secretValue.TNAVCID) {
            AdminMail = secretValue['TNAV Admin Mail'];
            ClientName = secretValue.TNAVCompanyName;
        } else if (details.ClientCompanyID === secretValue.AALCID) {
            AdminMail = secretValue['AAL Admin Mail'];
            ClientName=secretValue.AALCompanyName;
        } else {
            return {
                statusCode: 404,
                body: "Data Not Found"
            };
        }}
                const sendEmailResponse = await sendPaymentFailedEmail(paymentFailedDetails,AdminMail,ClientName);
                console.log(`Email sent to Response:`, sendEmailResponse);
    
    
                // update mailsent status
                const UpdateMailStatus = await UpdateMailStatustoDB(sendEmailResponse);
                console.log(`Successfully Update MailStatus to DB: `, UpdateMailStatus);
    
            } catch (error) {
                console.error(`Error sending email `, error);
                return error;
            }
        }
        else{
            console.log("No payment failed details in the database.");
        }

        

        const sapUpdationFailedDetails = await getSAPUpdationFailedDetails();
        console.log("SAPUpdationFailedDetails :", sapUpdationFailedDetails);

        if (sapUpdationFailedDetails.length != 0) {
            try {
                 for (const details of paymentFailedDetails) {
        if (details.ClientCompanyID === secretValue.CFLCID) {
            AdminMail = secretValue['CFL Admin Mail'];
            ClientName = secretValue.CFLCompanyName;
        } else if (details.ClientCompanyID === secretValue.TNAVCID) {
            AdminMail = secretValue['TNAV Admin Mail'];
            ClientName = secretValue.TNAVCompanyName;
        } else if (details.ClientCompanyID === secretValue.AALCID) {
            AdminMail = secretValue['AAL Admin Mail'];
            ClientName=secretValue.AALCompanyName;
        } else {
            return {
                statusCode: 404,
                body: "Data Not Found"
            };
        }}
                const sapUpdateEmailResponse = await sendSAPUpdateFailedEmail(sapUpdationFailedDetails,AdminMail,ClientName);
                console.log(`SAP Update Email sent to Response:`, sapUpdateEmailResponse);
        
                // update mailsent status
                const SAPUpdateMailStatus = await UpdateSAPMailStatustoDB(sapUpdateEmailResponse);
                console.log(`Successfully Update SAPMailStatus to DB: `, SAPUpdateMailStatus);
            }
            catch (error) {
                console.error(`Error sending email `, error);
                return error;
            }
        }
        else{
             console.log("No SAP Updation failed details in the database.");
        }

        return { statusCode: 200, body: 'Emails sent successfully.' };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }

    async function getPaymentFailedDetails() {
        const currentDate = new Date();
        currentDate.setHours(12, 0, 0, 0); // Set hours to midnight for accurate date comparison
        console.log("currentDate", currentDate);
        const targetDate = new Date(currentDate);
        targetDate.setDate(currentDate.getDate() - 1); // Set to the previous day 
        console.log("targetDate", targetDate);

        const params = {
            TableName: PaymentDetailsTableName,
            FilterExpression: "#PaymentStatus = :PaymentStatus AND #createdAt >= :targetDate AND #createdAt < :currentDate",
            ExpressionAttributeNames: {
                "#PaymentStatus": "PaymentStatus",
                "#createdAt": "createdAt"
            },
            ExpressionAttributeValues: {
                ":PaymentStatus": "Failed",
                ":targetDate": targetDate.toISOString(),
                ":currentDate": currentDate.toISOString(),
            },
        };

        try {
            const data = await dynamoDB.scan(params).promise();

            console.log("Response of PaymentFailedDetails From DynamoDB : ", data.Items.length);

            // Modify the data to fit your desired format
            const paymentFailedDetails = data.Items.map(item => ({
                id: item.id,
                Description: item.Description,
                Email: item.Email,
                FirstName: item.FirstName,
                LastName: item.LastName,
                createdAt: item.createdAt,
                ClientCompanyID:item.ClientCompanyID,
                ClientName:item.ClientName

            }));

            return paymentFailedDetails;
        } catch (err) {
            console.error(`Error querying DynamoDB:`, err);
            throw err;
        }
    }

    async function getSAPUpdationFailedDetails() {

        const currentDate = new Date();
        currentDate.setHours(12, 0, 0, 0); // Set hours to midnight for accurate date comparison
        console.log("currentDate", currentDate);
        const targetDate = new Date(currentDate);
        targetDate.setDate(currentDate.getDate() - 1); // Set to the previous day (23/02/2024)
        console.log("targetDate", targetDate);


        const params = {
            TableName: PaymentDetailsTableName,
            FilterExpression: "attribute_exists(#SAPErrorMessage) AND #SAPErrorMessage <> :Empty AND #createdAt >= :targetDate AND #createdAt < :currentDate",
            ExpressionAttributeNames: {
                "#SAPErrorMessage": "SAPErrorMessage",
                "#createdAt": "createdAt",
            },
            ExpressionAttributeValues: {
                ":Empty": "",
                ":targetDate": targetDate.toISOString(),
                ":currentDate": currentDate.toISOString(),

            },
        };

        try {
            const data = await dynamoDB.scan(params).promise();
            console.log("Response of SAPUpdationDetails From DynamoDB : ", data.Items.length);
            // Modify the data to fit your desired format
            const SApUpdationFailedDetails = data.Items.map(item => ({
                id: item.id,
                FailureReason: item.SAPErrorMessage,
                Email: item.Email,
                createdAt: item.createdAt,
                AfterPaymentSAPstatus: item.AfterPaymentSAPstatus,
                BeforePaymentSAPstatus: item.BeforePaymentSAPstatus,
                ClientCompanyID:item.ClientCompanyID,
                ClientName:item.ClientName

            }));
            return SApUpdationFailedDetails;
        } catch (err) {
            console.error(`Error querying SAPDynamoDB:`, err);
            throw err;
        }
    }

    async function sendPaymentFailedEmail(paymentFailedDetails, AdminMail,ClientName) {
    console.log('paymentFailedDetails:', paymentFailedDetails);
    try {
        // Group transactions by ClientName
        const transactionsByCompany = paymentFailedDetails.reduce((acc, curr) => {
            if (!acc[curr.ClientName]) {
                acc[curr.ClientName] = [];
            }
            acc[curr.ClientName].push(curr);
            return acc;
        }, {});

        // Iterate through each company and send an email
        const emailsSent = [];
        for (const [company, transactions] of Object.entries(transactionsByCompany)) {
            const transactionList = transactions.map(({ id, Description, createdAt }, index) =>
                `<tr style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; background-color: ${index % 2 === 0 ? '#f8f9fa' : '#e2e6ea'};">
                    <td style="padding: 12px;">${createdAt}</td>
                    <td style="padding: 12px;">${Description}</td>
                    <td style="padding: 12px;">${id}</td>
                </tr>`
            ).join('');

            const params = {
                Destination: { ToAddresses: [AdminMail] },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: `
                                <html lang="en">
                                    <head>
                                        <meta charset="UTF-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <title>Computop Failed Payment Transactions</title>
                                    </head>
                                    <body style="font-family: 'Roboto', sans-serif; margin: 0; padding: 0;">
                                        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                            <div style="text-align: center; font-size: 18px; color: red; background-color: #fce4ec; padding: 8px; border-radius: 8px;">
                                                <h2 style="margin: 0;">Computop Failed Payment Transactions</h2>
                                            </div>
                                            <p style="margin-bottom: 20px;">Hi ${company}</p>
                                            <p style="margin-bottom: 20px;">
                                                Hope this mail finds you well.
                                                We take a moment to summarize the list of recent payment transaction failures that occurred under your company.
                                            </p>
                                            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                                <thead>
                                                    <tr>
                                                        <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; background-color: #007bff; color: #fff;">Date(UTC)</th>
                                                        <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; background-color: #007bff; color: #fff;">Description</th>
                                                        <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; background-color: #007bff; color: #fff;">Transaction ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${transactionList}
                                                </tbody>
                                            </table>
                                            <div  style="text-align: center; background-color: #fff9c4; border-radius: 8px; padding: 12px; margin-top: 20px;">
                                                <p style="margin: 0; font-size: 12px; color: #333;">
                                                    If you have any questions or concerns, feel free to contact our Computop support team at
                                                    <a href="mailto:helpdesk@computop.com" style="color:blueviolet; text-decoration: none;">helpdesk@computop.com</a>
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
                        Data: 'Computop Failed Payment Transactions',
                    },
                },
                Source: 'noreply-awssupport@nipurnait.com',
            };

            console.log("Email Params : ", params);

            const response = await sesClient.send(new SendEmailCommand(params));
            emailsSent.push({ company,id: transactions[0].id, statusCode: response.$metadata.httpStatusCode });
        }

        console.log('All summary emails sent successfully.');
        return emailsSent;
    } catch (error) {
        console.error('Error sending summary emails:', error);
        throw error;
    }
}
    
    async function sendSAPUpdateFailedEmail(sapUpdationFailedDetails, AdminMail, ClientName) {
        console.log('sapUpdationFailedDetails:', sapUpdationFailedDetails);
    try {
        // Group transactions by ClientName
        const transactionsByCompany = sapUpdationFailedDetails.reduce((acc, curr) => {
            if (!acc[curr.ClientName]) {
                acc[curr.ClientName] = [];
            }
            acc[curr.ClientName].push(curr);
            return acc;
        }, {});

        // Iterate through each company and send an email
        const emailsSent = [];
        for (const [company, transactions] of Object.entries(transactionsByCompany)) {
            const transactionList = transactions.map(({ id, FailureReason, createdAt }, index) =>
                `<tr style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; background-color: ${index % 2 === 0 ? '#f8f9fa' : '#e2e6ea'};">
                    <td style="padding: 12px;">${createdAt}</td>
                    <td style="padding: 12px;">${FailureReason}</td>
                    <td style="padding: 12px;">${id}</td>
                </tr>`
            ).join('');

            const params = {
                Destination: { ToAddresses: [AdminMail] },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: `<html lang="en">
                                      <head>
                                        <meta charset="UTF-8" />
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                        <title>Payment Update Failed in SAP System</title>
                                      </head>
                                      <body style="font-family: 'Roboto', sans-serif; margin: 0; padding: 0;">
                                        <div style="max-width: 700px; margin: 20px auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                          <div style="text-align: center; font-size: 18px; color: red; background-color: #fce4ec; padding: 8px; border-radius: 8px;">
                                            <h2 style="margin: 0;">Payment Update Failed in SAP System</h2>
                                          </div>
                                          <div>
                                            <p>
                                              Hi,
                                              <span style="color: #007640; font-weight: bold;">${company}</span>
                                            </p>
                                            <p>
                                              We hope this mail finds you well. 
                                              Kindly find the below successful payment transactions that failed while updating in the SAP system. Your payment process is
                                              completed but sap update failed for the listed transactions below.
                                            </p>
                                          </div>
                                          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                            <thead>
                                              <tr>
                                                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; background-color: #007bff; color: #fff;">Date(UTC)</th>
                                                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; background-color: #007bff; color: #fff;">Description</th>
                                                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6; background-color: #007bff; color: #fff;">Transaction ID</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              ${transactionList}     
                                            </tbody>
                                          </table>
                                          <div style="text-align: center; background-color: #fff9c4; border-radius: 8px; padding: 15px; margin-top: 20px;">
                                            <p style="margin: 0; font-size: 15px; color: #333;">
                                              If you have any questions or concerns, feel free to contact your SAP team.
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
                        Data: 'Payment Update Failed in SAP System',
                    },
                },
                Source: 'noreply-awssupport@nipurnait.com',  
            };

            console.log("Email Params : ", params);

            const response = await sesClient.send(new SendEmailCommand(params));
            emailsSent.push({ company,id: transactions[0].id, statusCode: response.$metadata.httpStatusCode });
        }

        console.log("All SAP emails sent successfully.");
        return emailsSent;
    } catch (error) {
        console.error("Error processing SAP Updation Failed details:", error);
        throw error;
    }
}


    async function UpdateMailStatustoDB(sendEmailResponse) {
        for (let i = 0; i < sendEmailResponse.length; i++) {
            let params;
            if (sendEmailResponse[i].statusCode == 200) {

                params = {
                    TableName: PaymentDetailsTableName,
                    Key: {
                        id: { S: sendEmailResponse[i].id },
                    },
                    UpdateExpression: "SET PaymentMailStatus = :newStatus",
                    ExpressionAttributeValues: {
                        ":newStatus": { S: "Mail sent Successfully" },
                    },
                    ReturnValues: "ALL_NEW",
                };

            }
            else {
                params = {
                    TableName: PaymentDetailsTableName,
                    Key: {
                        id: { S: sendEmailResponse[i].id },
                    },
                    UpdateExpression: "SET PaymentMailStatus = :newStatus",
                    ExpressionAttributeValues: {
                        ":newStatus": { S: "Mail sent failed!" },
                    },
                    ReturnValues: "ALL_NEW",
                };

            }

            const command = new UpdateItemCommand(params);
            const DBResponse = await client.send(command);
            console.log("UpdatedDBResponse :", DBResponse);

        }
        return sendEmailResponse;
    }

    async function UpdateSAPMailStatustoDB(sendEmailResponse) {
        try {
            for (let i = 0; i < sendEmailResponse.length; i++) {

                let params;

                if (sendEmailResponse[i].statusCode == 200) {

                    params = {
                        TableName: PaymentDetailsTableName,
                        Key: {
                            id: { S: sendEmailResponse[i].id },
                        },
                        UpdateExpression: "SET SAPMailStatus = :newStatus",
                        ExpressionAttributeValues: {
                            ":newStatus": { S: "Mail sent Successfully" },
                        },
                        ReturnValues: "ALL_NEW",
                    };

                }
                else {
                    params = {
                        TableName: PaymentDetailsTableName,
                        Key: {
                            id: { S: sendEmailResponse[i].id },
                        },
                        UpdateExpression: "SET SAPMailStatus = :newStatus",
                        ExpressionAttributeValues: {
                            ":newStatus": { S: "Mail sent failed" },
                        },
                        ReturnValues: "ALL_NEW",
                    };

                }

                const command = new UpdateItemCommand(params);
                const DBResponse = await client.send(command);
                console.log("UpdatedDBResponse :", DBResponse);


            }

            return sendEmailResponse;
        }
        catch (err) {
            console.error("Error ", err);
            return err;
        }
    }

};

