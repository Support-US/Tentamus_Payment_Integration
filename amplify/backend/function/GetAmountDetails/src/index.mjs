
import AWS from 'aws-sdk';
import {DynamoDBClient,GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: process.env.REGION });
const PaymentDetailsTableName = `PaymentDetails-4mqwuuijsrbx5p6qtibxxchbsq-dev`;

export const handler = async (event) => {

    console.log(`EVENT: ${JSON.stringify(event)}`);

    try{
         let TableID =event.queryStringParameters.id;
         //Get ObjectID
         const GetDBData =await getDBData(TableID);
         console.log("getObjectID :", GetDBData);
         let getData = unmarshall(GetDBData);
         console.log("getData",getData );

         let returnData ={
           Amount: getData.Amount,
           Currency:getData.Currency
         }
         return {
             statusCode  : 200,
             headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          },
             body   : JSON.stringify(returnData)
         };
    }
    catch (error) {
        console.error("Error get db details:", error);
        throw error;
    }
    async function getDBData(TransID) {
        console.log("TransID :",TransID);
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
};
