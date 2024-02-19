import AWS from 'aws-sdk';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const sesClient = new SESClient({ region: process.env.REGION });  
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION }); // desired AWS region.
const PaymentDetailsTableName = `PaymentDetails-4mqwuuijsrbx5p6qtibxxchbsq-dev`;

export const handler = async (event) => {
  console.log(`Request EVENT: ${JSON.stringify(event)}`);
  
  try{
            const GETPaymentFailedDetails = await getPaymentFailedDetails();
            console.log("GETPaymentFailedDetails :",GETPaymentFailedDetails);
          
            for (const PaymentFailedDetail of GETPaymentFailedDetails) {
            const sendEmailResponse = await sendFailedPaymentEmail(PaymentFailedDetail);
            console.log(`Email sent to ${GETPaymentFailedDetails.Email}. Response:`, sendEmailResponse);
               
            const GETSAPUpdationFailedDetails = await getSAPUpdationFailedDetails();
            console.log("GETPaymentFailedDetails :",GETPaymentFailedDetails);

            for (const SAPUpdationFailedDetail of GETSAPUpdationFailedDetails) {
            if (SAPUpdationFailedDetail.SAPErrorMessage !== '') {
            const sapUpdateEmailResponse = await sendFailedSAPUpdateEmail(SAPUpdationFailedDetail);
            console.log(`SAP Update Email sent to ${SAPUpdationFailedDetail.Email}. Response:`, sapUpdateEmailResponse);
              }
             }
}

          return { statusCode: 200, body: 'Emails sent successfully.' };
           
  }catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
        
    } 
  async function getPaymentFailedDetails() {

  const params = {
  TableName: PaymentDetailsTableName,
  FilterExpression: "#PaymentStatus = :PaymentStatus",
  ExpressionAttributeNames: {
    "#PaymentStatus": "PaymentStatus",
   
  },
  ExpressionAttributeValues: {
    ":PaymentStatus": "Failed",
   
    
  },
};


    try {
      const data = await dynamoDB.scan(params).promise();
      console.log('Query result:', data.Items);

      console.log("Response of PaymentDetails From DynamoDB : ", data.Items);

      return data.Items; // Returning the queried items
    } catch (err) {
      console.error(`Error querying DynamoDB:`, err);
      throw err; // You may want to handle errors in a better way depending on your application needs
    }
  }
  
  async function getSAPUpdationFailedDetails() {

  const params = {
  TableName: PaymentDetailsTableName,
  FilterExpression: "#SAPErrorMessage <> :Empty",
  ExpressionAttributeNames: {
    "#SAPErrorMessage": "SAPErrorMessage",
   
  },
  ExpressionAttributeValues: {
    ":SAPErrorMessage": "",
   
    
  },
};


    try {
      const data = await dynamoDB.scan(params).promise();
      console.log('Query result:', data.Items);

      console.log("Response of PaymentDetails From DynamoDB : ", data.Items);

      return data.Items; // Returning the queried items
    } catch (err) {
      console.error(`Error querying DynamoDB:`, err);
      throw err; // You may want to handle errors in a better way depending on your application needs
    }
  }
  
  async function sendFailedPaymentEmail(getPaymentFailedDetails){
    let getDBData = unmarshall(getPaymentFailedDetails);
    let responseBody,subjectContent,textContent,status;
    if(getDBData.Status == "Failed"){
        responseBody =`<span>Unfortunately, the payment has failed.<span>`;
        subjectContent= `${getDBData.Description}`;
        textContent = `Your Payment Failed - TransactionID #${getDBData.TransID}`;
        status = `${getDBData.Status}`;
    }
    
    const params = { 
          Destination: { ToAddresses: [getPaymentFailedDetails.Email] }, 
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
                                    <span style="display: inline-block;font-size: 16px"">TransactionID #${getDBData.TransID}</span>
                                    </div>
                                  </div>
                                  <div style=" color : #F9AA33">Hello ${getDBData.FirstName} ${getDBData.LastName}
                                  </div>
                                  <div style="margin-top:20px">${responseBody}</div>
                                  <div style="margin-top: 50px">
                                        style="max-width: 40%; height: auto;">
                                  </div>
                                </div>
                          </body> 
                      </html>`,
              },
              Text: {
                  Charset: 'UTF-8',
                  Data: `${textContent}`
              }
              },
              Subject: {
                  Charset: 'UTF-8',
                  Data: `${subjectContent}`
              }
          },
          Source: 'meikandan.kg@nipurnait.com'
      };
      
      console.log("Params : ",params);
      
    try {
      let response = await sesClient.send(new SendEmailCommand(params));
      console.log("Response : ", response);
      return response;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  
  async function sendFailedSAPUpdateEmail(GETSAPUpdationFailedDetails) {
  let getDBData = unmarshall(GETSAPUpdationFailedDetails);
  let responseBody, subjectContent, textContent, status;

  if (
      getDBData.BeforePaymentSAPstatus === "Failed" &&
      getDBData.AfterPaymentSAPstatus === "Failed" &&
      getDBData.SAPErrorMessage !== "") {

    responseBody = `<span>Unfortunately, the SAP update has failed.<span>`;
    subjectContent = `${getDBData.SAPErrorMessage}`;
    textContent = `SAP Update Failed - TransactionID #${getDBData.TransID}`;
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
                      <span style="display: inline-block;font-size: 16px"">TransactionID #${getDBData.TransID}</span>
                    </div>
                  </div>
                  <div style=" color : #F9AA33">Hello ${getDBData.FirstName} ${getDBData.LastName}
                  </div>
                  <div style="margin-top:20px">${responseBody}</div>
                  <div style="margin-top: 50px">
                    <!-- Add additional content or styling here if needed -->
                  </div>
                </div>
              </body>
            </html>`,
          },
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