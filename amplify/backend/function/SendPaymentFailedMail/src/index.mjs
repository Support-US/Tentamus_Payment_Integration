import { unmarshall } from '@aws-sdk/util-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const sesClient = new SESClient({ region: process.env.REGION });  
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION }); // desired AWS region.

export const handler = async (event) => {
          const GETPaymentFailedDetails = await getPaymentFailedDetails();
          console.log("GETPaymentFailedDetails :",GETPaymentFailedDetails);

          const SendFailedPaymentEmail = await sendFailedPaymentEmail();
          console.log("GETPaymentFailedDetails :",SendFailedPaymentEmail);
  async function getPaymentFailedDetails() {

    const params = {
      TableName: OrganizationDetailsTableName,
      FilterExpression: "#PaymentStatus = :Failed",
      ExpressionAttributeNames: {
        "#PaymentStatus": "Failed",
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
  async function sendFailedPaymentEmail(getPaymentFailedDetails){
    let responseBody,subjectContent,textContent,status;
    if(getPaymentFailedDetails.Status == "Failed"){
        responseBody =`<span>Unfortunately, the payment has failed.<span>`;
        subjectContent= `${getPaymentFailedDetails.Description}`;
        textContent = `Your Payment Failed - TransactionID #${getPaymentFailedDetails.TransID}`;
        status = `${getPaymentFailedDetails.Status}`;
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
                                    <span style="display: inline-block;font-size: 16px"">TransactionID #${getPaymentFailedDetails.TransID}</span>
                                    </div>
                                  </div>
                                  <div style=" color : #F9AA33">Hello ${getPaymentFailedDetails.FirstName} ${getPaymentFailedDetails.LastName}
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
      
      let response = await sesClient.send(new SendEmailCommand(params));
         
      console.log("Response : ",response);
  
      return response;
  }
};