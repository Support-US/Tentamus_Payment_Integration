import AWS from 'aws-sdk';
import { Blowfish } from 'egoroof-blowfish';
import { Buffer } from 'buffer';
import pkg from 'crypto-js';
const { HmacSHA256, enc } = pkg;

import { DynamoDBClient,PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });
import { v4 as uuidv4 } from 'uuid';


const secretsManager = new AWS.SecretsManager();
const data = await secretsManager.getSecretValue({SecretId: `Tentamus_Payment_Integration`}).promise(); 
const secretValue = JSON.parse(data.SecretString);
const HMacPassword = secretValue.HMacPassword;
const blowfishKey = secretValue.blowfishKey;
const merchantID  = secretValue.MerchantID;
const notifyURL   =secretValue.APIGatewayURL;
            
const PaymentDetailsTableName = `PaymentDetails-4mqwuuijsrbx5p6qtibxxchbsq-dev`;            
            
            
export const handler = async (event, context) => {
    
console.log(`Request EVENT: ${JSON.stringify(event)}`);

  const resolver = {
      
    Mutation: {
        
      PaymentDetailsCreate: async () => {
          
        let paymentDetails = (event.arguments.input);
        
        let createdPaymentdetails = await createPaymentDetails(paymentDetails);
        console.log("Response of CreatePaymentHistory : ", createdPaymentdetails);
            
        // Calculate the HMAC
        let calculatedHMAC =await generateHMAC(createdPaymentdetails,merchantID,paymentDetails.Amount, paymentDetails.Currency,HMacPassword);
        console.log("calculatedHMAC :", calculatedHMAC);
        
        
        // let CalculatedAmount = (parseInt(paymentDetails.Amount*100)).toString();
        // console.log("CalculatedAmount :", CalculatedAmount);
         
        let dataToEncrypt = `MerchantID=${merchantID}&TransID=${createdPaymentdetails}&Currency=${paymentDetails.Currency}&Amount=${paymentDetails.Amount}&MAC=${calculatedHMAC}&URLNotify=${notifyURL}&URLSuccess=${paymentDetails.SuccessURL}&URLFailure=${paymentDetails.FailureURL}`;
        console.log("dataToEncrypt :", dataToEncrypt);
        // Encrypt the string
        let EncryptedString  = await  BlowfishEncryption(dataToEncrypt, blowfishKey,);
        console.log("EncryptedString for Response :",EncryptedString);
        



       return {
                            EncryptedString: EncryptedString,
                            Length: EncryptedString.length,
                            MerchantID: merchantID,
                            CalculatedHMAC: calculatedHMAC,
                            TransactionID: createdPaymentdetails
                        
          };

      }
      
    }
    
  };
  
  try {

    const typeHandler = resolver[event.typeName];

    if (typeHandler) {
        
      const resolver = typeHandler[event.fieldName];
      
      if (resolver) {
        var result = await resolver(event);
        console.log("final result ", result);
        return result;
      }
      else {
        throw new Error("Resolver not found.");
      }
    }
  } catch (error) {
    console.error('Error:', error);
        throw error;
    }

 async function createPaymentDetails(){ 
     
             try{ 
      let id = uuidv4();
      console.log("Auto Generate ID : ",id);
     
        let paymentDetails = (event.arguments.input);
        console.log("Given PaymentDetails : ", paymentDetails);
        
        const invoices = paymentDetails.InvoiceNumbers.map((item,index)=>{
            let invoiceno = `InvoiceNo ${index}`;
            return { [invoiceno] : { S: item.InvoiceNo }};
        });
       
        // console.log("Given Invoice Details array : ",invoices);
        
        const factor = Math.pow(10, paymentDetails.CurrencyDecimalDigit);
        const amount = (paymentDetails.Amount / factor).toString();
        console.log('Calculated Amount:', amount);

            let createdDynamoDBData = await client.send(
                    new PutItemCommand({
                        TableName: PaymentDetailsTableName,
                        Item:{
                          id: { S : id},
                          FirstName : { S:paymentDetails.FirstName },
                          LastName :  { S:paymentDetails.LastName },
                          CompanyName : { S:paymentDetails.CompanyName },
                          Email :  { S:paymentDetails.Email },
                          AddressLine1 :  { S:paymentDetails.AddressLine1 },
                          AddressLine2 :  { S:paymentDetails.AddressLine2 },
                          Country :  { S:paymentDetails.Country },
                          State :  { S:paymentDetails.State },
                          City :  { S:paymentDetails.City },
                          PostalCode :  { S:paymentDetails.PostalCode},
                          PhoneNumber :  { S:paymentDetails.PhoneNumber },
                          Amount :  { S:amount },
                          Currency :  { S:paymentDetails.Currency },
                          PaymentStatus :  { S:paymentDetails.PaymentStatus },
                          InvoiceNumbers: { M: Object.assign({}, ...invoices) }, 
                          SuccessURL :  { S:paymentDetails.SuccessURL },
                          FailureURL :  { S:paymentDetails.FailureURL },
                          CurrencyDecimalDigit : { S:paymentDetails.CurrencyDecimalDigit },
                          BeforePaymentSAPstatus:{ S:"" },
                          AfterPaymentSAPstatus: { S:"" }, 
                          SAPErrorMessage:{ S:"" },
                          SAPObjectID:{ S:"" }
            
          }})
          );
          
          console.log("After Created Response ID : ",id);

            return id;
            }
        catch(err){
            console.error("Create a PaymentDetails in Dynamodb : ",err);
            return err;
        }
    }

 async function generateHMAC(id, merchantID, Amount, Currency, hmacPassword){
            const message = `*${id}*${merchantID}*${Amount}*${Currency}`;
            console.log("Message", message, "secretKey", hmacPassword);
            const hash = HmacSHA256(message, hmacPassword);
            const hashInHex = hash.toString(enc.Hex);
            console.log("hashInHex---", hashInHex);
        
        return hashInHex.toUpperCase();
  }
 
 async function  BlowfishEncryption(dataToEncrypt, blowfishKey) {
   
    let plainString = dataToEncrypt;
    console.log("INSIDE BLOWFISH Function : ", plainString, "blowfishKey", blowfishKey);

    const bf = new Blowfish(blowfishKey, 0, 3);
    // bf.setIv('00000000');
    // Encryption
    const encoded = bf.encode(plainString);
    const encodedText = Buffer.from(encoded).toString('hex').toUpperCase();
    console.log("ENCODED TEXT", encodedText);

    const newhex = Uint8Array.from(Buffer.from(encodedText, 'hex'));
    const decoded = bf.decode(newhex, Blowfish.TYPE.STRING);
    console.log("DECODED TEXT", decoded);

    return encodedText;
}

};