import AWS from 'aws-sdk';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: process.env.REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-4mqwuuijsrbx5p6qtibxxchbsq-dev`;

export const handler = async (event) => {
  console.log(`Request EVENT: ${JSON.stringify(event)}`);

  try {
    const paymentFailedDetails  = await getPaymentFailedDetails();
    // console.log("PaymentFailedDetails :", paymentFailedDetails);

    if (!paymentFailedDetails || paymentFailedDetails.length === 0) {
          console.log("No payment failed details in the database.");
          return { statusCode: 200, body: 'No payment failed details in the database.' };
        }
        
      for (const paymentFailedDetail of paymentFailedDetails) {
    try {
        const sendEmailResponse = await sendFailedPaymentEmail(paymentFailedDetails);
        console.log(`Email sent to ${paymentFailedDetail.Email}. Response:`, sendEmailResponse);
    } catch (error) {
        console.error(`Error sending email for ${paymentFailedDetail.Email}:`, error);
        
    }


      const sapUpdationFailedDetails = await getSAPUpdationFailedDetails();
      console.log("SAPUpdationFailedDetails :", sapUpdationFailedDetails);
      
      
      if (!sapUpdationFailedDetails || sapUpdationFailedDetails.length === 0) {
          console.log("No SAP Updation failed details in the database.");
          return { statusCode: 200, body: 'No SAP Updation failed details in the database.' };
        }

      for (const sapUpdationFailedDetail of sapUpdationFailedDetails) {
        if (sapUpdationFailedDetail.SAPErrorMessage !== '') {
          const sapUpdateEmailResponse = await sendFailedSAPUpdateEmail(sapUpdationFailedDetail);
          console.log(`SAP Update Email sent to ${sapUpdationFailedDetail.Email}. Response:`, sapUpdateEmailResponse);
        } else {
          console.log(`No SAP failed details in DB`);
        }
      }
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
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
     const currentTime = new Date();
    const params = {  
      TableName: PaymentDetailsTableName,
      // FilterExpression: "#PaymentStatus = :PaymentStatus",
      // FilterExpression: "#PaymentStatus = :PaymentStatus AND #createdAt >= :twentyFourHoursAgo",
       FilterExpression: "#PaymentStatus = :PaymentStatus AND #createdAt BETWEEN :startTime AND :endTime",
      ExpressionAttributeNames: {
        "#PaymentStatus": "PaymentStatus",
        "#createdAt": "createdAt",
      },
      ExpressionAttributeValues: {
        ":PaymentStatus": "Failed",
        ":startTime": twentyFourHoursAgo.toISOString(),
        ":endTime": currentTime.toISOString(),
      },
    };

    try {
      const data = await dynamoDB.scan(params).promise();
      console.log('Query result:', data.Items);

      console.log("Response of PaymentDetails From DynamoDB : ", data.Items);
      
      // Modify the data to fit your desired format
     const paymentFailedDetails = data.Items.map(item => ({
      id: item.id,
      Description: item.Description,
      Email: item.Email,
      
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
      // FilterExpression: "attribute_exists(#SAPErrorMessage) AND #SAPErrorMessage <> :Empty",
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
      console.log('Query result:', data.Items);

      console.log("Response of PaymentDetails From DynamoDB : ", data.Items);

      return data.Items;
    } catch (err) {
      console.error(`Error querying SAPDynamoDB:`, err);
      throw err;
    }
  }

  async function sendFailedPaymentEmail(paymentFailedDetails) {
  console.log(" send paymnet mail :",paymentFailedDetails);
  try {
    // Create a map to aggregate transactions by email
    const emailTransactionsMap = new Map();

    // Aggregate transactions by email
    for (const paymentFailedDetail of paymentFailedDetails) {
      const { id, Description, Email,FirstName, LastName } = paymentFailedDetail;

      if (!emailTransactionsMap.has(Email)) {
        emailTransactionsMap.set(Email, []);
      }

      emailTransactionsMap.get(Email).push({ id, Description, FirstName, LastName });
    }

    // Send summary email for each unique email address
    for (const [email, transactions] of emailTransactionsMap) {
      const transactionList = transactions.map(({ id, Description }) => `<li><strong>TransactionID:</strong> ${id}, <strong>Description:</strong> ${Description}</li>`).join('');

      const firstName = transactions[0].FirstName; // Assuming the same FirstName for all transactions
      const lastName = transactions[0].LastName; 
      const params = {
  Destination: { ToAddresses: [email] },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: `
          <html>
            <body style="font-family: Arial, sans-serif;">

              <div style="text-align: center;">
                <div style="margin-bottom: 10px;">
                  <span style="font-size: 20px; color: #FF0000; font-weight: bold;">Failed Payment Summary</span>
                </div>
              </div>

              <div style="color: #F9AA33; text-align: left;">
                <p>Hello ${firstName} ${lastName},</p>
              </div>

              <div style="margin-top: 20px; text-align: left;">
                <p>Payment failed for the following transactions:</p>
                <ul>
                  ${transactionList}
                </ul>
              </div>

              <div style="margin-top: 20px; color: #333; text-align: left;">
                If you have any questions or concerns, please contact Computop support team.
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


      console.log(`Email Params for ${email}: `, params);

      // Send summary email
      const response = await sesClient.send(new SendEmailCommand(params));
      console.log(`Email Response for ${email}: `, response);
    }

    console.log('All summary emails sent successfully.');
  } catch (error) {
    console.error('Error sending summary emails:', error);
    throw error;
  }
}

  async function sendFailedSAPUpdateEmail(sapUpdationFailedDetail) {
    let getDBData = sapUpdationFailedDetail;
    let responseBody, subjectContent, textContent, status;

    if (
      getDBData.BeforePaymentSAPstatus === "Failed" &&
      getDBData.AfterPaymentSAPstatus === "Failed" &&
      getDBData.SAPErrorMessage !== ""
    ) {
      responseBody = `<span>Unfortunately, the SAP updation has failed.<span>`;
      subjectContent = `${getDBData.SAPErrorMessage}`;
      textContent = `SAP Updation Failed - TransactionID #${getDBData.TransID}`;
      status = `${getDBData.Status}`;

      const params = {
  Destination: { ToAddresses: [getDBData.Email] },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: `
          <html>
            <body>
              <div>
                <div style="text-align: right;">
                  <div>
                    <span style="display: inline-block;font-size: 20px;color: #000000;font-weight:bold">${status}</span>
                  </div>
                  <div>
                    <span style="display: inline-block;font-size: 16px">TransactionID #${getDBData.id}</span>
                  </div>
                </div>
                <div style="color : #F9AA33">Hello ${getDBData.FirstName} ${getDBData.LastName}</div>
                <div style="margin-top:20px">${responseBody}</div>
                <div style="margin-top: 50px">
                  <!-- Add additional content or styling here if needed -->
                </div>
              </div>
            </body>
          </html>`,
      },
      Text: {
        Charset: 'UTF-8',
        Data: `${textContent}`,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: `${subjectContent}`,
    },
  },
  Source: 'meikandan.kg@nipurnait.com',
};

      console.log("Params : ", params);

      try {
        let response = await sesClient.send(new SendEmailCommand(params));
        console.log("Response : ", response);
        return response;
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    }
    // If conditions are not met, return null or handle as needed
    return null;  
  }
  
};
