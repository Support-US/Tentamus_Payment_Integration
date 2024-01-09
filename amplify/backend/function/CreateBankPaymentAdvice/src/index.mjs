
// Import AWS SDK services using ESM syntax
import { SecretsManager, CognitoIdentityServiceProvider } from '@aws-sdk/client';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// Create instances of AWS services
const secretsManager = new SecretsManager();
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const environmentVariable = process.env.ENV;
// console.log('Value of MY_ENV_VARIABLE:', environmentVariable);

export const handler = async (event) => {
    // const data = await secretsManager.getSecretValue({ SecretId: `${customertena_CustomerPortal_${environmentVariable}` }).promise();
    // const secretValue = data.SecretString;
    // console.log('Secret value:', JSON.parse(secretValue).SAPHostName);

   
    const PaymentHistoryTableName = `PaymentHistory-${JSON.parse(secretValue).AppSyncID}-${environmentVariable}`;

    console.log(`EVENT: ${JSON.stringify(event)}`);

    const userPoolId = 'ap-south-1_RanqLifbp';
    const clientId = 'pcjvjl1auvbt1lo2htjro29ij';
    const username = 'santhoshkumar';
    const password = 'Nipurna@321';

    try {
        let getPaymentHistoryDetail = await getPaymentHistoryDetails();
        // console.log("PaymentHistoryDetails Response : ", getPaymentHistoryDetail);
       
        let CreateBankPaymentAdvice = await CreatePaymentAdvice(getPaymentHistoryDetail, getOrganizationDetail, getContactDetail);
    }
    catch (err) {
        console.error("ERROR : ", err);
        throw err;
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    async function CreatePaymentAdvice(PaymentHistoryDetail, OrganizationDetail, ContactDetail) {

        let CustomerID;
        if (PaymentHistoryDetail[0].CustomerId == ContactDetail.CustomerUUID) {
            CustomerID = ContactDetail.CustomerId;
        }

        try {
            let CurrentDate = PaymentHistoryDetail[0].createdAt;
            CurrentDate = CurrentDate.split('T');
            var postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global">
               <soapenv:Header/>
               <soapenv:Body>
                  <glob:BankAdviceBundleMaintainRequest_sync>
                     <BasicMessageHeader></BasicMessageHeader>
                     <BankAdvice>
                        <CompanyID>${OrganizationDetail[0].CompanyID}</CompanyID>
                        <ExternalAdviceID>${PaymentHistoryDetail[0].TransactionReferenceNo}</ExternalAdviceID>
                        <AccountDebitIndicator>false</AccountDebitIndicator>
                        <AdviceDate>${CurrentDate[0]}</AdviceDate>
                        <PostingDate>${CurrentDate[0]}</PostingDate>
                        <PaymentFormCode>05</PaymentFormCode>
                        <EffectivePaymentAmount currencyCode="USD">${PaymentHistoryDetail[0].PaymentAmount}</EffectivePaymentAmount>
                        <HouseBankAccountInternalID>1100062590</HouseBankAccountInternalID>
                        <BusinessPartnerInternalID>${CustomerID}</BusinessPartnerInternalID>
                        <PaymentReference>
                           <ID>${PaymentHistoryDetail[0].TransactionReferenceNo}</ID>
                        </PaymentReference>
                        <PaymentExplanationItem>`;
            let paymentHistoryDetails = PaymentHistoryDetail[0].PaymentHistoryDetails;
            console.log("PaymentHistoryDetails :", paymentHistoryDetails);
            paymentHistoryDetails.forEach((element, index) => {
                postData = postData + ` <ID>${index + 1}</ID>
               <NetAmount currencyCode="USD">${element.Amount}</NetAmount>
               <PaymentTransactionInitiatorInvoiceReference>
                  <ID>${element.ExternalReference}</ID>
               </PaymentTransactionInitiatorInvoiceReference>
               <PaymentTransactionDestinatedInvoiceReference>
                  <ID>${element.InvoiceId}</ID>
                </PaymentTransactionDestinatedInvoiceReference>
                </PaymentExplanationItem>
                <PaymentExplanationItemListCompleteTransmissionIndicator>true</PaymentExplanationItemListCompleteTransmissionIndicator>
                </BankAdvice>
                </glob:BankAdviceBundleMaintainRequest_sync>
                </soapenv:Body>
                </soapenv:Envelope>`;
            });
            // ${OrganizationDetail[0].BankID}

            const response = await axios.post(`${JSON.parse(secretValue).SAPHostName}/sap/bc/srt/scs/sap/managebankadvicein?sap-vhost=${JSON.parse(secretValue).SAPHostName.replace(/^https?:\/\//, '')}`, postData, {
                headers: {
                    'Content-Type': 'text/xml',
                    Authorization: "Basic " + new Buffer.from(`${JSON.parse(secretValue).SoapUsername}` + ":" + `${JSON.parse(secretValue).SoapPassword}`).toString("base64")
                },
            });

            console.log("API RESPONSE For CREATE PaymentAdvice ---->",response.status);

            let xmlString = JSON.stringify(response.data);

            // Extract the HTTP response code
            const httpResponseCode = response.status;

            console.log('HTTP Response Code : ', httpResponseCode);

            const maxSeverityCodeRegex = /<MaximumLogItemSeverityCode>(.*?)<\/MaximumLogItemSeverityCode>/;
            const maxSeverityCodeMatch = xmlString.match(maxSeverityCodeRegex);
            // console.log(maxSeverityCodeMatch);
            const maximumLogItemSeverityCode = maxSeverityCodeMatch ? maxSeverityCodeMatch[1] : null;

            console.log('MaximumLogItemSeverityCode:', maximumLogItemSeverityCode);
            if (maximumLogItemSeverityCode == null && httpResponseCode == "200") {
                // Define regular expressions to match ID, MaximumLogItemSeverityCode and UUID elements
                const idRegex = /<ID>(.*?)<\/ID>/;
                const uuidRegex = /<UUID>(.*?)<\/UUID>/;

                // Use regular expressions to extract values
                const idMatch = xmlString.match(idRegex);
                const uuidMatch = xmlString.match(uuidRegex);

                // Extract the values from the matches
                const ID = idMatch ? idMatch[1] : null;
                const UUID = uuidMatch ? uuidMatch[1] : null;

                // console.log('ID:', ID);
                // console.log('UUID:', UUID);

                var paymentadvice = {
                    "BankPaymentAdviceId": ID,
                    "BankPaymentAdviceUUID": UUID,
                    "BankPaymentAdviceStatus": "Created"
                };

                console.log("Final paymentadvice Resposne : ", JSON.stringify(paymentadvice));

                let changeCartStatus = await changeUserCartStatus(paymentadvice);
                console.log("After Updating usercart table status Ordered : ", changeCartStatus);

                let dummyFunction = await DummyFunction();
                console.log("DUMMY Function", dummyFunction);

                let createNotification = await createNotificationItem(paymentadvice, PaymentHistoryDetail, ID);
                console.log("After Create Notification Record for success : ", createNotification);

                return paymentadvice;
            }
            else if (maximumLogItemSeverityCode == "1" && httpResponseCode == "200") {
                // Define regular expressions to match ID, MaximumLogItemSeverityCode and UUID elements
                const idRegex = /<ID>(.*?)<\/ID>/;
                const uuidRegex = /<UUID>(.*?)<\/UUID>/;

                // Use regular expressions to extract values
                const idMatch = xmlString.match(idRegex);
                const uuidMatch = xmlString.match(uuidRegex);

                // Extract the values from the matches
                const ID = idMatch ? idMatch[1] : null;
                const UUID = uuidMatch ? uuidMatch[1] : null;

                // console.log('ID:', ID);
                // console.log('UUID:', UUID);

                var Paymentadvice = {
                    "BankPaymentAdviceId": ID,
                    "BankPaymentAdviceUUID": UUID,
                    "BankPaymentAdviceStatus": "Created"
                };

                console.log("Final Paymentadvice Resposne : ", JSON.stringify(Paymentadvice));

                let changeCartStatus = await changeUserCartStatus(Paymentadvice);
                console.log("After Updating usercart table status Ordered : ", changeCartStatus);

                let dummyFunction = await DummyFunction();
                console.log("DUMMY Function", dummyFunction);

                let createNotification = await createNotificationItem(paymentadvice, PaymentHistoryDetail, ID);
                console.log("After Create Notification Record for success : ", createNotification);

                return Paymentadvice;
            }
            else if (maximumLogItemSeverityCode == "2" && httpResponseCode == "200") {

                // Define regular expressions to match ID, MaximumLogItemSeverityCode and UUID elements
                const idRegex = /<ID>(.*?)<\/ID>/;
                const uuidRegex = /<UUID>(.*?)<\/UUID>/;

                // Use regular expressions to extract values
                const idMatch = xmlString.match(idRegex);
                const uuidMatch = xmlString.match(uuidRegex);

                // Extract the values from the matches
                const ID = idMatch ? idMatch[1] : null;
                const UUID = uuidMatch ? uuidMatch[1] : null;

                // console.log('ID:', ID);
                // console.log('UUID:', UUID);

                var Paymentadvice = {
                    "BankPaymentAdviceId": ID,
                    "BankPaymentAdviceUUID": UUID,
                    "BankPaymentAdviceStatus": "Created"
                };

                console.log("Final Paymentadvice Resposne : ", JSON.stringify(Paymentadvice));

                let changeCartStatus = await changeUserCartStatus(Paymentadvice);
                console.log("After Updating usercart table status Ordered : ", changeCartStatus);

                let dummyFunction = await DummyFunction();
                console.log("DUMMY Function", dummyFunction);

                let createNotification = await createNotificationItem(paymentadvice, PaymentHistoryDetail, ID);
                console.log("After Create Notification Record for success : ", createNotification);

                return Paymentadvice;

            }
            else {

                var Paymentadvice = {
                    "PlaceOrderStatus": "Failed"
                };

                console.log("Final Paymentadvice Resposne : ", JSON.stringify(Paymentadvice));

                return Paymentadvice;
            }

        } catch (error) {
            console.error('Error calling external API:', error);
            throw new Error('Failed to create Paymentadvice from the API');
        }
    }

    async function changeUserCartStatus(paymentadvice) {
        const updateParams = {
            TableName: PaymentHistoryTableName,
            Key: { id: event.data.object.client_reference_id },
            UpdateExpression: 'SET SAPBankPaymentadviceId = :sapBankPaymentadviceId,SAPBankPaymentadviceStatus = :sapBankPaymentadviceStatus,SAPBankPaymentadviceUUID = :sapBankPaymentadviceUUID',
            ExpressionAttributeValues: {
                ':sapBankPaymentadviceId': paymentadvice.BankPaymentAdviceId,
                ':sapBankPaymentadviceUUID': paymentadvice.BankPaymentAdviceUUID,
                ':sapBankPaymentadviceStatus': paymentadvice.BankPaymentAdviceStatus,
            },
            ReturnValues: 'ALL_NEW',
        };

        try {
            const result = await dynamoDB.update(updateParams).promise();
            console.log('BankPaymentAdvice updated successfully!!!');
            return result;
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }

    async function createNotificationItem(paymentadvice, PaymentHistoryDetail, BankPaymentId) {

        console.log("paymentadvice Details in CreateNotification Function : ", paymentadvice);

        try {
            const authenticationData = {
                Username: username,
                Password: password,
            };

            const authenticationDetails = new AuthenticationDetails(authenticationData);

            const poolData = {
                UserPoolId: userPoolId,
                ClientId: clientId,
            };

            const userPool = new CognitoUserPool(poolData);

            const userData = {
                Username: username,
                Pool: userPool,
            };

            const cognitoUser = new CognitoUser(userData);

            const authenticateUserPromise = () => {
                return new Promise((resolve, reject) => {
                    cognitoUser.authenticateUser(authenticationDetails, {
                        onSuccess: (session) => resolve(session),
                        onFailure: (err) => reject(err),
                    });
                });
            };

            const session = await authenticateUserPromise();

            const accessToken = session.getAccessToken().getJwtToken();
            const idToken = session.getIdToken().getJwtToken();
            const apiEndpoint = 'https://yiqiwr2habbthcxditcmfgf3jy.appsync-api.ap-south-1.amazonaws.com/graphql'; // Replace with your AppSync API endpoint

            const mutation = `
                      mutation MyMutation($input: CreateNotificationInput!) {
                          createNotification(input: $input) {
                          CustomerId
                          MessageText
                          NotificationStatus
                          id
                          createdAt
                          updatedAt
                          NotificationReason
                          NotificationData
                        }
                        }`;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Include the access token
            };

            const variables = {
                input: {
                    CustomerId: PaymentHistoryDetail[0].CustomerId,
                    MessageText: '',
                    NotificationStatus: "Unread",
                    NotificationReason: "PaymentAdvice Updated",
                    NotificationData: `[{ \"PlaceOrderStatus\":\"\",\"UserCartTableID\":\"\",\"SalesOrderId\":\"\" }]`
                },
            };

            if (paymentadvice.BankPaymentAdviceStatus === 'Created') {
                variables.input.MessageText = `Bank Payment Cleared Successfully.Bank Payment ID is ${Number(BankPaymentId)}. Payment Advice has been updated in SAP.`;
            } else {
                variables.input.MessageText = `Bank Payment Cleared Successfully.Bank Payment ID is ${Number(BankPaymentId)}.there was an issue updating Payment Advice in SAP.`;
            }

            const response = await axios.post(
                apiEndpoint,
                {
                    query: mutation,
                    variables,
                },
                {
                    headers,
                }
            );

            const responseData = response.data;
            console.log('Create successfull Notification Item :', responseData);

            return responseData;

        } catch (error) {
            console.error('Failed To Create Notification Item Error :', error);
            throw new Error('Failed To Create Notification Item Error :', error);
        }
    }

    async function getPaymentHistoryDetails(id) {
        const params = {
            TableName: PaymentHistoryTableName,
            FilterExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': event.data.object.client_reference_id, // event.data.object.client_reference_id
            },
        };

        try {
            const data = await dynamoDB.scan(params).promise();
            return data.Items; // Returning the queried items
        } catch (err) {
            console.error('Error querying DynamoDB:', err);
            throw err; 
        }
    }

};