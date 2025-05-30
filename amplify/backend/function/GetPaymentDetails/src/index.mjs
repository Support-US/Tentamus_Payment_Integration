import AWS from 'aws-sdk';
import { Blowfish } from 'egoroof-blowfish';
import { Buffer } from 'buffer';
import pkg from 'crypto-js';
const { HmacSHA256, enc } = pkg;
import { DynamoDBClient, PutItemCommand, QueryCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({ region: "us-east-2" });
import { v4 as uuidv4 } from 'uuid';
import { unmarshall } from '@aws-sdk/util-dynamodb';



const secretsManager = new AWS.SecretsManager();
const data = await secretsManager.getSecretValue({ SecretId: `Tentamus_Payment_Integration` }).promise();
let HMacPassword, blowfishKey, merchantID, CompanyName;
const secretValue = JSON.parse(data.SecretString);
console.log("secretValue : ", secretValue);
const notifyURL = secretValue.APIGatewayURL;
let Headers = secretValue.headers;
const PaymentDetailsTableName = secretValue.DBTable;
const CardDetailsTableName = secretValue.CardDetailsDBTable
  ;

export const handler = async (event, context) => {

  console.log(`Request EVENT: ${JSON.stringify(event)}`);
  let paymentDetails = JSON.parse(event.body);

  if (paymentDetails.ClientCompanyID == secretValue.CFLCID) {
    HMacPassword = secretValue['Columbia Laboratories HMacPassword'];
    blowfishKey = secretValue['Columbia Laboratories blowfishKey'];
    merchantID = secretValue['Columbia Laboratories MerchantID'];
  }
  else if (paymentDetails.ClientCompanyID == secretValue.TNAVCID) {
    HMacPassword = secretValue['Tentamus North America Virginia HMacPassword'];
    blowfishKey = secretValue['Tentamus North America Virginia blowfishKey'];
    merchantID = secretValue['Tentamus North America Virginia MerchantID'];
  }
  else if (paymentDetails.ClientCompanyID == secretValue.AALCID) {
    HMacPassword = secretValue['Adamson Analytical Labs HMacPassword'];
    blowfishKey = secretValue['Adamson Analytical Labs blowfishKey'];
    merchantID = secretValue['Adamson Analytical Labs MerchantID'];
  }
  else {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": Headers,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: "Data not Found",
    };
  }

  let createdPaymentdetails = await createPaymentDetails(paymentDetails);
  console.log("Response of CreatePaymentHistory : ", JSON.stringify(createdPaymentdetails));
  // console.log("Response of paymentDetails : ", paymentDetails);

  if (paymentDetails.ClientName == secretValue.CFLCompanyName) {
    CompanyName = secretValue.CFLCompanyName;

  } else if (paymentDetails.ClientName == secretValue.TNAVCompanyName) {
    CompanyName = secretValue.TNAVCompanyName;

  } else if (paymentDetails.ClientName == secretValue.AALCompanyName) {
    CompanyName = secretValue.AALCompanyName;
  }
  else {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": Headers,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: "Data not Found",
    };
  }

  // Calculate the HMAC
  let calculatedHMAC = await generateHMAC(createdPaymentdetails.ClientName, merchantID, paymentDetails.Amount, paymentDetails.Currency, HMacPassword);
  // console.log("calculatedHMAC :", calculatedHMAC);


  // let dataToEncrypt = `MerchantID=${merchantID}&TransID=${createdPaymentdetails.ClientName}&RefNr=${createdPaymentdetails.id}&UserData=${createdPaymentdetails.InvoiceNumbers}&Currency=${paymentDetails.Currency}&Amount=${paymentDetails.Amount}&MAC=${calculatedHMAC}&URLNotify=${notifyURL}?q=${CompanyName}&URLSuccess=${paymentDetails.SuccessURL}&URLFailure=${paymentDetails.FailureURL}`;
  // console.log("dataToEncrypt :", dataToEncrypt);


  let GetCardDetails = await GetCardDetailsFromDB(paymentDetails.Email);
  // console.log("GetCardDetails :", GetCardDetails);

  let base64Result = "";
  let cardDetails = null;

  if (GetCardDetails) {
    const getDBData = unmarshall(GetCardDetails);
        console.log("✅ Unmarshalled Data:", getDBData);

    // card Data
    cardDetails = {
      cardholderName: getDBData.cardHolderName,
      number: getDBData.pcnrNumber,
      expiryDate: getDBData.expiryDate, 
      brand: getDBData.cardBrand
    };

    console.log("cardDetails :", cardDetails);

    // Convert & Print Base64
    base64Result = await convertToBase64(cardDetails);
    console.log("Base64 Encoded Card Details:", base64Result);
  }

  // Construct dataToEncrypt without Card if no card details
  let dataToEncrypt = `MerchantID=${merchantID}&TransID=${createdPaymentdetails.ClientName}`;

  if (base64Result) {
    dataToEncrypt += `&Card=${base64Result}`;
  }

  dataToEncrypt += `&RefNr=${createdPaymentdetails.id}&UserData=${createdPaymentdetails.InvoiceNumbers}&Currency=${paymentDetails.Currency}&Amount=${paymentDetails.Amount}&MAC=${calculatedHMAC}&URLNotify=${notifyURL}?q=${CompanyName}&URLSuccess=${paymentDetails.SuccessURL}&URLFailure=${paymentDetails.FailureURL}&OrderDesc=test:0000`

  console.log("dataToEncrypt :", dataToEncrypt);

  // Encrypt the string
  let EncryptedString = await BlowfishEncryption(dataToEncrypt, blowfishKey,);
  // console.log("EncryptedString for Response :", EncryptedString);


  let responseData = {
    EncryptedString: EncryptedString,
    Length: EncryptedString.length,
    MerchantID: merchantID,
    TransactionID: createdPaymentdetails.id,
  };

  console.log("responseData :", responseData);


  async function convertToBase64(data) {
    const jsonString = JSON.stringify(data);
    console.log("data :", data);

    const base64String = Buffer.from(jsonString, "utf-8").toString("base64"); // Standard Base64 encoding with padding
    return base64String;
  }

  async function createPaymentDetails() {

    try {
      let id = uuidv4();
      console.log("Auto Generate ID : ", id);

      console.log("paymentDetails.InvoiceNumbers :", paymentDetails.InvoiceNumbers);
      const invoices = paymentDetails.InvoiceNumbers.map((item, index) => {
        let invoiceno = `InvoiceNo ${index}`;
        return { [invoiceno]: { S: item.InvoiceNo } };
      });

      // console.log("Given Invoice Details array : ",invoices);

      const factor = Math.pow(10, paymentDetails.CurrencyDecimalDigit);
      const amount = (paymentDetails.Amount / factor).toString();
      console.log('Calculated Amount:', amount);
      // Trim the CompanyName to remove extra spaces before calling generateHMAC
      let trimmedCompanyName = paymentDetails.CompanyName.trim();

      let createdDynamoDBData = await client.send(
        new PutItemCommand({
          TableName: PaymentDetailsTableName,
          Item: {
            id: { S: id },
            FirstName: { S: paymentDetails.FirstName },
            LastName: { S: paymentDetails.LastName },
            CompanyName: { S: trimmedCompanyName },
            Email: { S: paymentDetails.Email },
            AddressLine1: { S: paymentDetails.AddressLine1 },
            AddressLine2: { S: paymentDetails.AddressLine2 },
            Country: { S: paymentDetails.Country },
            State: { S: paymentDetails.State },
            City: { S: paymentDetails.City },
            PostalCode: { S: paymentDetails.PostalCode },
            PhoneNumber: { S: paymentDetails.PhoneNumber },
            Amount: { S: amount },
            Currency: { S: paymentDetails.Currency },
            PaymentStatus: { S: paymentDetails.PaymentStatus },
            InvoiceNumbers: { M: Object.assign({}, ...invoices) },
            SuccessURL: { S: paymentDetails.SuccessURL },
            FailureURL: { S: paymentDetails.FailureURL },
            CurrencyDecimalDigit: { S: (paymentDetails.CurrencyDecimalDigit).toString() },
            BeforePaymentSAPstatus: { S: "" },
            AfterPaymentSAPstatus: { S: "" },
            SAPErrorMessage: { S: "" },
            SAPObjectID: { S: "" },
            Description: { S: "" },
            PaymentMailStatus: { S: "" },
            SAPMailStatus: { S: "" },
            PaymentId: { S: "" },
            createdAt: { S: paymentDetails.createdAt },
            ClientName: { S: paymentDetails.ClientName },
            ClientCompanyID: { S: paymentDetails.ClientCompanyID }

          }
        })
      );

      console.log("After Created Response ID : ", id);

      // Now if you need to extract and format InvoiceNumbers as a comma-separated string:
      const invoiceNumbersArray = paymentDetails.InvoiceNumbers.map(item => item.InvoiceNo);
      const invoiceNumbersString = invoiceNumbersArray.join(',');

      // Return the required fields  
      return {
        InvoiceNumbers: invoiceNumbersString,  // Return invoices array/map as it is
        id: id,
        ClientName: trimmedCompanyName,
        Email: paymentDetails.Email
      };

    }
    catch (err) {
      console.error("Create a PaymentDetails in Dynamodb : ", err);
      return err;
    }
  }

  async function generateHMAC(id, merchantID, Amount, Currency, hmacPassword) {
    const message = `*${id}*${merchantID}*${Amount}*${Currency}`;
    console.log("Message", message, "secretKey", hmacPassword);
    const hash = HmacSHA256(message, hmacPassword);
    const hashInHex = hash.toString(enc.Hex);
    console.log("hashInHex---", hashInHex);

    return hashInHex.toUpperCase();
  }

  async function BlowfishEncryption(dataToEncrypt, blowfishKey) {

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

  async function GetCardDetailsFromDB(email) {
    console.log("📧 Fetching Card Details for Email:", email);

    const params = {
      TableName: CardDetailsTableName,  // Ensure this matches your actual table name
      Key: {
        id: { S: email },
      },

    };

    console.log("📌 Query Parameters:", JSON.stringify(params, null, 2));

    try {
      const command = new GetItemCommand(params);
      const response = await client.send(command);

      // Access the retrieved item from response.Item
      const item = response.Item;

      // Handle the retrieved item as needed
      console.log('CardDetails Retrieved:', item);
      return item;

    } catch (error) {
      console.error("❌ Error retrieving CardDetails:", error);
      return null;
    }
  }

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": Headers,
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify(responseData),
  };
};





