import AWS from 'aws-sdk';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const sesClient = new SESClient({ region: process.env.REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const client = new DynamoDBClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-4mqwuuijsrbx5p6qtibxxchbsq-dev`;

export const handler = async (event) => {
    console.log(`Request EVENT: ${JSON.stringify(event)}`);

    try {
        const paymentFailedDetails = await getPaymentFailedDetails();
        // console.log("PaymentFailedDetails :", paymentFailedDetails);

        if (!paymentFailedDetails || paymentFailedDetails.length === 0) {
            console.log("No payment failed details in the database.");
            return { statusCode: 200, body: 'No payment failed details in the database.' };
        }
        try {
            const sendEmailResponse = await sendPaymentFailedEmail(paymentFailedDetails);
            console.log(`Email sent to Response:`, sendEmailResponse);


            // update mailsent status
            const UpdateMailStatus = await UpdateMailStatustoDB(sendEmailResponse);
            console.log(`Successfully Update MailStatus to DB: `, UpdateMailStatus);

        } catch (error) {
            console.error(`Error sending email `, error);
        }
        
        const sapUpdationFailedDetails = await getSAPUpdationFailedDetails();
        console.log("SAPUpdationFailedDetails :", sapUpdationFailedDetails);

        if (!sapUpdationFailedDetails || sapUpdationFailedDetails.length === 0) {
            console.log("No SAP Updation failed details in the database.");
            return { statusCode: 200, body: 'No SAP Updation failed details in the database.' };
        }

        const sapUpdateEmailResponse = await sendSAPUpdateFailedEmail(sapUpdationFailedDetails);
        console.log(`SAP Update Email sent to Response:`, sapUpdateEmailResponse);

        // update mailsent status
        const SAPUpdateMailStatus = await UpdateSAPMailStatustoDB(sapUpdateEmailResponse);
        console.log(`Successfully Update SAPMailStatus to DB: `, SAPUpdateMailStatus);


        return { statusCode: 200, body: 'Emails sent successfully.' };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }

    async function getPaymentFailedDetails() {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const params = {
            TableName: PaymentDetailsTableName,
            FilterExpression: "#PaymentStatus = :PaymentStatus AND #createdAt >= :twentyFourHoursAgo",
            ExpressionAttributeNames: {
                "#PaymentStatus": "PaymentStatus",
                "#createdAt": "createdAt"
            },
            ExpressionAttributeValues: {
                ":PaymentStatus": "Failed",
                ":twentyFourHoursAgo": twentyFourHoursAgo.toISOString()
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
                createdAt: item.createdAt

            }));

            return paymentFailedDetails;
        } catch (err) {
            console.error(`Error querying DynamoDB:`, err);
            throw err;
        }
    }

    async function getSAPUpdationFailedDetails() {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const params = {
            TableName: PaymentDetailsTableName,
            FilterExpression: "attribute_exists(#SAPErrorMessage) AND #SAPErrorMessage <> :Empty AND #createdAt >= :twentyFourHoursAgo",
            ExpressionAttributeNames: {
                "#SAPErrorMessage": "SAPErrorMessage",
                "#createdAt": "createdAt",
            },
            ExpressionAttributeValues: {
                ":Empty": "",
                ":twentyFourHoursAgo": twentyFourHoursAgo.toISOString(),
            },
        };

        try {
            const data = await dynamoDB.scan(params).promise();
            console.log("Response of SAPUpdationDetails From DynamoDB : ", data.Items.length );
            // Modify the data to fit your desired format
            const SApUpdationFailedDetails = data.Items.map(item => ({
                id: item.id,
                FailureReason: item.SAPErrorMessage,
                Email: item.Email,
                createdAt: item.createdAt,
                AfterPaymentSAPstatus: item.AfterPaymentSAPstatus,
                BeforePaymentSAPstatus: item.BeforePaymentSAPstatus,

            }));
            return SApUpdationFailedDetails;
        } catch (err) {
            console.error(`Error querying SAPDynamoDB:`, err);
            throw err;
        }
    }

    async function sendPaymentFailedEmail(paymentFailedDetails) {
        const emailResponses = [];
        try {
            // Create a map to aggregate transactions by email
            const emailTransactionsMap = new Map();

            // Aggregate transactions by email
            for (const paymentFailedDetail of paymentFailedDetails) {
                const { id, Description, Email, FirstName, LastName, createdAt } = paymentFailedDetail;

                if (!emailTransactionsMap.has(Email)) {
                    emailTransactionsMap.set(Email, []);
                }
                emailTransactionsMap.get(Email).push({ id, Description, FirstName, LastName, createdAt });
            }
            
            for (const [email, transactions] of emailTransactionsMap) {
                const transactionList = transactions
                    .map(({ id, Description, createdAt }) => `<tr><td>${createdAt}</td><td>${Description}</td><td>${id}</td></tr>`)
                    .join('');

                const firstName = transactions[0].FirstName; // Assuming the same FirstName for all transactions
                const lastName = transactions[0].LastName;

                const params = {
                    Destination: { ToAddresses: [email] },
                    Message: {
                        Body: {
                            Html: {
                                Charset: 'UTF-8',
                                Data: `
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Payment failure summary</title>
                    <style>
                      body {
                        font-family: "Roboto", sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f8f9fa;
                      }
                      .container {
                        max-width: 800px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                      }
                      .heading {
                        text-align: center;
                        font-size: 15px;
                        color: red;
                        background-color: #fce4ec;
                        padding: 1px;
                        border-radius: 8px;
                      }
                      table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                      }
                      th,
                      td {
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid #dee2e6;
                      }
                      th {
                        background-color: #007bff;
                        color: #fff;
                      }
                      td {
                        background-color: #f8f9fa;
                      }
                      tr:nth-child(even) td {
                        background-color: #e2e6ea;
                      }
                      p {
                        margin-bottom: 20px;
                      }
                      .footer {
                        text-align: center;
                        background-color: #fff9c4;
                        border-radius: 8px;
                        padding: 20px;
                        margin-top: 20px;
                      }
                      .footer p {
                        margin: 0;
                        font-size: 14px;
                        color: #333;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="heading">
                        <h2>Payment Failed Summary</h2>
                      </div>
                      <p>Hi ${firstName} ${lastName},</p>
                      <p>
                        I hope this message finds you well. I wanted to take a moment to provide
                        you with a summary of recent payment failures in transactions that have
                        occurred on your end.
                      </p>
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Transaction ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${transactionList}
                        </tbody>
                      </table>
                      <div class="footer">
                        <p>
                          If you have any questions or concerns, feel free to contact our
                          Computop support team at
                          <a href="mailto:helpdesk@computop.com"> helpdesk@computop.com </a>
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
                            Data: 'Failed Payment Summary',
                        },
                    },
                    Source: 'noreply-procustomer@nipurnait.com',
                };

                const response = await sesClient.send(new SendEmailCommand(params));
                // Store the response in the array
                emailResponses.push({
                    email: email,
                    TransID: transactions,
                    response: response.$metadata.httpStatusCode,
                });
            }
            console.log('All summary emails sent successfully.');
            return emailResponses;
        } catch (error) {
            console.error('Error sending summary emails:', error);
            throw error;
        }
    }

    async function sendSAPUpdateFailedEmail(sapUpdationFailedDetails) {
        const emailResponses = [];
        try {
            // Create a map to aggregate transactions by email and transaction ID
            const emailTransactionsMap = new Map();

            // Aggregate transactions by email and transaction ID
            for (const SAPUpdationFailedDetail of sapUpdationFailedDetails) {
                const { id, FailureReason, Email, createdAt } = SAPUpdationFailedDetail;

                if (!emailTransactionsMap.has(Email)) {
                    emailTransactionsMap.set(Email, [] );
                }
                
                emailTransactionsMap.get(Email).push({ id, FailureReason , createdAt });
            }
            
            // Send summary email for each unique email address and transaction ID
            for (const [email, transactions] of emailTransactionsMap) {
                const transactionList = transactions
                .map(({ id, FailureReason, createdAt }) => `<tr><td>${createdAt}</td><td>${FailureReason.ErrorMessage}</td><td>${id}</td></tr>`)
                .join('');
                    const params = {
                        Destination: { ToAddresses: [email] },
                        Message: {
                            Body: {
                                Html: {
                                    Charset: 'UTF-8',
                                    Data: `<html lang="en">
                                               <head>
                                                <meta charset="UTF-8" />
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                                <title>Document</title>
                                                <style>
                                                  body {
                                                    font-family: "Roboto", sans-serif;
                                                    margin: 0;
                                                    padding: 0;
                                                    background-color: #f2f2f2;
                                                  }
                                                        .highlight {
                                                            color: #007640;
                                                          }
                                                        table {
                                                            width: 100%;
                                                            border-collapse: collapse;
                                                            margin-top: 20px;
                                                          }
                                                          th,
                                                          td {
                                                            padding: 12px;
                                                            text-align: left;
                                                            border-bottom: 1px solid #dee2e6;
                                                          }
                                                          th {
                                                            background-color: #007bff;
                                                            color: #fff;
                                                          }
                                                          td {
                                                            background-color: #f8f9fa;
                                                          }
                                                          tr:nth-child(even) td {
                                                            background-color: #e2e6ea;
                                                          }

                                                  .error {
                                                    text-align: center;
                                                    background-color: #fff9c4;
                                                    border-radius: 8px;
                                                    padding: 10px;
                                                    margin-bottom: 20px;
                                                  }
                                            
                                                  h2 {
                                                    margin: 0;
                                                    font-size: 24px;
                                                    color: red;
                                                  }
                                            
                                                  .footer {
                                                    text-align: center;
                                                    background-color: #e3f2fd;
                                                    border-radius: 8px;
                                                    padding: 20px;
                                                    margin-top: 20px;
                                                  }
                                            
                                                  .footer p {
                                                    margin: 0;
                                                    font-size: 15px;
                                                    color: #333;
                                                  }
                                                </style>
                                                <link
                                                  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
                                                  rel="stylesheet"
                                                />
                                              </head>
                                              <body>
                                                <table
                                                  role="presentation"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                  border="0"
                                                  align="center"
                                                >
                                                  <tr>
                                                    <td>
                                                      <div class="error">
                                                        <h2>SAP Updation Failed!</h2>
                                                      </div>
                                            
                                                      <div>
                                                        <p>
                                                          Hi,
                                                          <span class="highlight">Analytical Food Laboratories (AFL)</span>
                                                        </p>
                                                        <p>
                                                    I hope this message finds you well. I wanted to take a moment to
                                                    provide you with details regarding the failed SAP update.your payment 
                                                    process is completed but sap updation was failed.
                                                  </p>
                                                </div>
                                                <table>
                                                  <thead>
                                                  <tr>
                                                        <th>Date</th>
                                                        <th>Failure Reason</th>
                                                        <th>Transaction ID</th>
                                                      </tr>
                                                    </thead>
                                                  <tbody>
                                                    ${transactionList}
                                              </tbody>
                                            </table>
                                            <div class="footer">
                                              <p>
                                                If you have any questions or concerns, feel free to contact your
                                                SAP team.
                                              </p>
                                            </div>
                                          </body>
                                        </html>
                                      `,
                                },
                            },
                            Subject: {
                                Charset: 'UTF-8',
                                Data: 'SAP Updation Failed',
                            },
                        },
                        Source: 'noreply-procustomer@nipurnait.com',
                    };
    
                    try {
                        let response = await sesClient.send(new SendEmailCommand(params));
    
                        // Store the response in the array
                        emailResponses.push({
                            email: email,
                            TransID: transactions,
                            response: response.$metadata.httpStatusCode,
                        });
                        
                    } catch (error) {
                        console.error("Error sending SAP Updation Failed email:", error);
                        // Handle the error as needed
                    }
            }
        

            console.log("All SAP emails sent successfully.");
            return emailResponses;
        } catch (error) {
            console.error("Error processing SAP Updation Failed details:", error);
            throw error;
        }
    }

    async function UpdateMailStatustoDB(sendEmailResponse) {
        for (let i = 0; i < sendEmailResponse.length; i++) {
            let transactionsID = sendEmailResponse[i].TransID;
            for (let j = 0; j < transactionsID.length; j++) {
                let params;
                if (sendEmailResponse[i].response == 200) {

                    params = {
                        TableName: PaymentDetailsTableName,
                        Key: {
                            id: { S: transactionsID[j].id },
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
                            id: { S: transactionsID[j].id },
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

        }
        return sendEmailResponse;
    }

    async function UpdateSAPMailStatustoDB(sendEmailResponse) {
        console.log("DB Send",sendEmailResponse);
        try{
            for(let i=0; i< sendEmailResponse.length; i++){
            let transaction = sendEmailResponse[i].TransID;
            for(let j=0 ; j< transaction.length ; j++){
                let params;
                
                if (sendEmailResponse[i].response == 200) {

                    params = {
                        TableName: PaymentDetailsTableName,
                        Key: {
                            id: { S: transaction[j].id },
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
                            id: { S: transaction[j].id },
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
        }
          
        return sendEmailResponse;     
        }
        catch(err){
            console.error("Error ",err);
            return err;
        }
    }


};

