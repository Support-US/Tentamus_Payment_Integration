import AWS from 'aws-sdk';
import axios from 'axios'; 
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const secretsManager = new AWS.SecretsManager();
const client = new DynamoDBClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-4mqwuuijsrbx5p6qtibxxchbsq-dev`;

export const handler = async (event) => {   
       
        console.log(`EVENT: ${JSON.stringify(event)}`);
        
        const data = await secretsManager.getSecretValue({ SecretId:`Tentamus_Payment_Integration`}).promise();
        const secretValue = JSON.parse(data.SecretString);

    try {
         
        if (event.Records && event.Records.length > 0) {
            
            // Assuming the first record in the array contains the data
            let DynamoDBdata = event.Records[0].dynamodb.NewImage;
            if(event.Records[0].eventName === "INSERT"){
                
                if (DynamoDBdata) { 
                    
                    let response = await CreateData(DynamoDBdata);
                      console.log("response :",response); 
                      return response;
                  
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
        return err;
    }  

async function CreateData(DynamoDBdata){
    
    
    let JsonDBData = unmarshall(DynamoDBdata);
    console.log(`EVENT Marshal : ${JSON.stringify(JsonDBData)}`);
    let Invoice = JsonDBData.InvoiceNumbers; 
    const invoices = Object.keys(Invoice).map(key => ({
        InvoiceNo: Invoice[key]
    }));
        console.log(invoices);
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
                    Status: JsonDBData.PaymentStatus,
                    currencyCode: JsonDBData.Currency,
                    Amount: JsonDBData.Amount,
                    TransactionID: JsonDBData.id,
                    Zip_PostalCode: JsonDBData.PostalCode,
                    ZPaymentAdviceItem: invoices,
                    ClientName: JsonDBData.ClientName,
                    CompanyID :JsonDBData.ClientCompanyID,
                    
                };
    console.log("Postdata:", JSON.stringify(postData));
    const postdata = JSON.stringify(postData);
    
    try{
    const response = await axios.post(
        `${(secretValue).SAPHostName}/sap/byd/odata/cust/v1/payment_advice/ZPaymentAdviceRootCollection`, postdata, {
        headers: {
                
                'Content-Type': 'application/json', 
                 Authorization: "Basic " + new Buffer.from(`${(secretValue).OdataUsername}` + ":" + `${(secretValue).OdataPassword}`).toString("base64")
 
        },
    });  
    
    console.log("API RESPONSE For CREATE PaymentDetails ---->", response.status);
    console.log("Response :", JSON.stringify(response.data.d.results));  
   let SAPdata = response.data.d.results;
   console.log("SAPdata :",JSON.stringify(SAPdata)) ;
     if (response.status == 201) {
                const updatedResponse = await UpdatePaymentDetailsID(SAPdata);
                console.log("updatedResponse :", updatedResponse);
                return {
                    statusCode:response.status,
                    body: updatedResponse,
                };
            } else {
                const UpdateFailureStatus = await UpdateFailurestatus(response,JsonDBData,"");
                console.log("UpdateFailurestatus :", UpdateFailureStatus);
                    
                return {
                    statusCode: response.status,
                    body: JSON.stringify({ error: "SAP server is down" }),
                };
            } 
      
    }
    catch (err) { 
        console.error('Error Occurred in SAP:', err);
        const UpdateFailureStatus = await UpdateFailurestatus(err,JsonDBData,"Server Error");
        console.log("UpdateFailurestatus :", UpdateFailureStatus);
        return {
            statusCode: 500,
            body: err, 
        
        }; 
    }   
   
                  
}

async function UpdatePaymentDetailsID(SAPdata) {
    console.log("UPDATE data ",SAPdata );
    let tableId = SAPdata.TransactionID;
    try{
        const params = {
            TableName: PaymentDetailsTableName,  
            Key: { 
                id: { S: tableId },
            },
            UpdateExpression: "SET SAPObjectID = :newobjecttId,BeforePaymentSAPstatus = :newStatusMessage",
            ExpressionAttributeValues: {
                ":newobjecttId": { S: SAPdata.ObjectID },
                ":newStatusMessage": { S:"Success" },
            },
            ReturnValues: "ALL_NEW",
        };
    
        const command = new UpdateItemCommand(params);
        const DBResponse = await client.send(command);  
        console.log("DBResponse :", DBResponse);
        return DBResponse;
    }
    catch(err){
        console.log("ERROR Occurred in Update Payment DB",err);
        return err; 
    }
    
}

async function UpdateFailurestatus(error,data,errStatus) {
    
    let tableId = data.TransID;
    console.log("Error ",error);
    console.log("data ",data);
    console.log("errStatus ",errStatus); 
    let params;
    try {
        if(errStatus ==  ""){
             params = {
            TableName: PaymentDetailsTableName,
            Key: {
                id: { S: tableId },
            },
            UpdateExpression: "SET PaymentStatus = :newStatus, BeforePaymentSAPstatus = :newStatusMessage,SAPErrorMessage = :newerrorMessage",
            ExpressionAttributeValues: {
                ":newStatus": { S: "inprogress" },
                ":newStatusMessage": { M: { "FailureStatusCode": { S: error.status } } },
                ":newerrorMessage": { M: { "FailureStatusCode": { S: error.response.status}, "ErrorMessage": { S: error.message } } },
            },
            ReturnValues: "ALL_NEW",
        };
        } 
        else{
         params = {
            TableName: PaymentDetailsTableName,
            Key: {
                id: { S: tableId },
            },
             UpdateExpression: "SET PaymentStatus = :newStatus, BeforePaymentSAPstatus = :newStatusMessage,SAPErrorMessage = :newerrorMessage",
            ExpressionAttributeValues: {
                ":newStatus": { S: "inprogress" },
                ":newStatusMessage": { M: { "FailureStatusCode": { S: (error.status)} } },
                ":newerrorMessage": { M: {  "ErrorMessage": { S: error.message } } },
            },
            ReturnValues: "ALL_NEW",
        };
    }
        const command = new UpdateItemCommand(params);
    
        
        const DBResponse = await client.send(command);
        console.log("DBResponse :", DBResponse);
        return DBResponse;
    } catch (error) {
        console.error("Error updating status:", error);
        return error;
    }
} 
};