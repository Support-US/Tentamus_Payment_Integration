import AWS from 'aws-sdk';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Blowfish } from 'egoroof-blowfish';
import { Buffer } from 'buffer';
import pkg from 'crypto-js';
const { HmacSHA256, enc } = pkg;
const client = new DynamoDBClient({ region: process.env.REGION });

const secretsManager = new AWS.SecretsManager();
const data = await secretsManager.getSecretValue({ SecretId: `Tentamus_Payment_Integration` }).promise();
let HMacPassword, blowfishKey, merchantID, CompanyName;
const secretValue = JSON.parse(data.SecretString);
console.log("secretValue : ", secretValue);
const notifyURL = secretValue.APIGatewayURL;
let TableID, PayId, Status, Code, MerchantID, CompanyId;
let Headers = secretValue.headers;
const PaymentDetailsTableName = secretValue.DBTable;


export const handler = async (event) => {

  console.log(`EVENT: ${JSON.stringify(event)}`);

  const body = JSON.parse(event.body);
  CompanyId = body.companyName;
  TableID = body.id;
  PayId = body.payId;
  Status = body.status;
  Code = body.code;
  MerchantID = body.mid;

  console.log("ClientMerchantID", MerchantID);

  try {
    if (MerchantID == secretValue['Columbia Laboratories MerchantID']) {
      HMacPassword = secretValue['Columbia Laboratories HMacPassword'];
      blowfishKey = secretValue['Columbia Laboratories blowfishKey'];
      merchantID = secretValue['Columbia Laboratories MerchantID'];
    }
    else if (MerchantID == secretValue['Tentamus North America Virginia MerchantID']) {
      HMacPassword = secretValue['Tentamus North America Virginia HMacPassword'];
      blowfishKey = secretValue['Tentamus North America Virginia blowfishKey'];
      merchantID = secretValue['Tentamus North America Virginia MerchantID'];
    }
    else if (MerchantID == secretValue['Adamson Analytical Labs MerchantID']) {
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
        body: "Data Not Found",
      };
    }

    // Calculate the HMAC
    const calculatedHMAC = await RetrygenerateHMAC(PayId, CompanyId, merchantID, Status, Code, HMacPassword);
    console.log("calculatedHMAC :", calculatedHMAC);
    const Hmac = body.mac;
    console.log("Hmac :", Hmac);

    if (Hmac.trim() === calculatedHMAC.trim() && !event.headers.hasOwnProperty('x-retry')) {

      //Get ObjectID
      const GetDBData = await getDBData(TableID);
      console.log("getObjectID :", GetDBData);

      let getData = unmarshall(GetDBData);
      console.log("getData", getData);

      let returnData = {
        Amount: getData.Amount,
        Currency: getData.Currency,
        ClientName: getData.ClientName,
      };

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": Headers,
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(returnData),
      };

    } else {
      if (Hmac.trim() === calculatedHMAC.trim() && Status == "FAILED" && event.headers['x-retry'] === 'true') {

        let id = generateNumericUUID();
        console.log("Auto Generate Numeric UUID with Hyphen: ", id);

        //Get ObjectID
        const GetDBData = await getDBData(TableID);
        console.log("GetDBData :", GetDBData);

        let getData = unmarshall(GetDBData);
        console.log("getData", getData);

        let invoice = await collectInvoiceNumbers(getData.InvoiceNumbers);

        console.log(invoice);

        let createdPaymentdetails = await createPaymentDetails(getData, id);
        console.log("Response of CreatePaymentHistory : ", createdPaymentdetails);

        if (getData.ClientName == secretValue.CFLCompanyName) {
          CompanyName = secretValue.CFLCompanyName;
        }
        else if (getData.ClientName == secretValue.TNAVCompanyName) {
          CompanyName = secretValue.TNAVCompanyName;

        } else if (getData.ClientName == secretValue.AALCompanyName) {
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
        // Parse CurrencyDecimalDigit as an integer
        const decimalDigits = Number(getData.CurrencyDecimalDigit);
        console.log("decimalDigits", decimalDigits);
        // Calculate the factor by raising 10 to the power of decimalDigits
        const factor = Math.pow(10, decimalDigits);
        console.log("factor", factor);
        const multipliedAmount = getData.Amount * factor;
        console.log("multipliedAmount", multipliedAmount);

        // Calculate the HMAC
        let calculatedHMAC = await generateHMAC(CompanyId, merchantID, multipliedAmount, getData.Currency, HMacPassword);
        console.log("calculatedHMAC :", calculatedHMAC);

        let dataToEncrypt = `MerchantID=${merchantID}&TransID=${CompanyId}&RefNr=${getData.id}&UserData=${invoice}&Currency=${getData.Currency}&Amount=${multipliedAmount}&MAC=${calculatedHMAC}&URLNotify=${notifyURL}?q=${CompanyName}&URLSuccess=${getData.SuccessURL}&URLFailure=${getData.FailureURL}`;
        console.log("dataToEncrypt :", dataToEncrypt);


        // Encrypt the string
        let EncryptedString = await BlowfishEncryption(dataToEncrypt, blowfishKey,);
        console.log("EncryptedString for Response :", EncryptedString);


        let returnData = {
          TransID: id,
          Amount: getData.Amount,
          Currency: getData.Currency,
          ClientName: getData.ClientName,
          CompanyName: getData.CompanyName,
          PhoneNumber: getData.PhoneNumber,
          City: getData.City,
          Country: getData.Country,
          InvoiceNumbers: getData.InvoiceNumbers,
          State: getData.State,
          PostalCode: getData.PostalCode,
          AddressLine1: getData.AddressLine1,
          FirstName: getData.FirstName,
          LastName: getData.LastName,
          EncryptedString: EncryptedString,
          Length: EncryptedString.length,
          MerchantID: merchantID,
        };
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": Headers,
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          },
          body: JSON.stringify(returnData),
        };

      } else {
        console.log("Error : '⚠️HMAC validation failed' ");
        return {
          statusCode: 403,
          headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": Headers,
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          },
          body: JSON.stringify({ success: false, message: '⚠️HMAC validation failed' }),
        };
      }
    }


  } catch (error) {
    console.error("Error get db details:", error);
    throw error;
  }

  async function getDBData(TransID) {
    console.log("TransID :", TransID);
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

  async function RetrygenerateHMAC(PayID, transID, merchantID, Status, code, hmacPassword) {
    const message = `${PayID}*${transID}*${merchantID}*${Status}*${code}`;
    console.log("Message", message, "secretKey", hmacPassword);

    const hash = HmacSHA256(message, hmacPassword);
    const hashInHex = hash.toString(enc.Hex);
    // console.log("hashInHex---", hashInHex);

    return hashInHex.toUpperCase();
  }

  async function createPaymentDetails(paymentDetails, id) {

    try {
      // Create a new Date object with the provided date
      var currentDate = new Date();

      // Options for formatting the date and time
      var options = {
        timeZone: 'Asia/Kolkata', // Indian Standard Time
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-hour format
      };

      // Format the date and time in Indian Standard Time (IST)
      var indianDateTime = currentDate.toLocaleString('en-IN', options);

      // Convert the formatted date and time to ISO 8601 format
      var isoDateTime = indianDateTime.replace(/(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+):(\d+)/, '$3-$2-$1T$4:$5:$6');

      // Append 'Z' to indicate Zulu time zone
      isoDateTime += 'Z';

      console.log("Indian Date and Time in desired format: ", isoDateTime);


      console.log("paymentDetails.InvoiceNumbers :", paymentDetails.InvoiceNumbers);

      // Convert the object into an array of objects suitable for DynamoDB
      const invoices = Object.entries(paymentDetails.InvoiceNumbers).map(([key, value]) => ({
        [key]: { S: value }
      }));

      console.log("Given Invoice Details array : ", invoices);


      let createdDynamoDBData = await client.send(
        new PutItemCommand({
          TableName: PaymentDetailsTableName,
          Item: {
            id: { S: id },
            FirstName: { S: paymentDetails.FirstName },
            LastName: { S: paymentDetails.LastName },
            CompanyName: { S: paymentDetails.CompanyName },
            Email: { S: paymentDetails.Email },
            AddressLine1: { S: paymentDetails.AddressLine1 },
            AddressLine2: { S: paymentDetails.AddressLine2 },
            Country: { S: paymentDetails.Country },
            State: { S: paymentDetails.State },
            City: { S: paymentDetails.City },
            PostalCode: { S: paymentDetails.PostalCode },
            PhoneNumber: { S: paymentDetails.PhoneNumber },
            Amount: { S: paymentDetails.Amount },
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
            PaymentId: { S: "" },
            SAPMailStatus: { S: "" },
            createdAt: { S: indianDateTime },
            ClientName: { S: paymentDetails.ClientName },
            ClientCompanyID: { S: paymentDetails.ClientCompanyID }

          }
        })
      );

      console.log("After Created Response ID : ", id);

      return createdDynamoDBData;
    }
    catch (err) {
      console.error("Create a PaymentDetails in Dynamodb : ", err);
      return err;
    }
  }

  async function generateHMAC(id, merchantID, Amount, Currency, hmacPassword) {
    const message = `*${id}*${merchantID}*${Amount}*${Currency}`;
    // console.log("Message", message, "secretKey", hmacPassword);
    const hash = HmacSHA256(message, hmacPassword);
    const hashInHex = hash.toString(enc.Hex);
    // console.log("hashInHex---", hashInHex);

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
    // console.log("ENCODED TEXT", encodedText);

    const newhex = Uint8Array.from(Buffer.from(encodedText, 'hex'));
    const decoded = bf.decode(newhex, Blowfish.TYPE.STRING);
    // console.log("DECODED TEXT", decoded);

    return encodedText;
  }

  async function collectInvoiceNumbers(invoiceData) {
    let result = [];

    if (Array.isArray(invoiceData)) {
      // If it's an array, loop over the array
      invoiceData.forEach(invoice => {
        for (let key in invoice) {
          if (invoice.hasOwnProperty(key)) {
            result.push(invoice[key]);
          }
        }
      });
    } else {
      // If it's an object, loop over the object
      for (let key in invoiceData) {
        if (invoiceData.hasOwnProperty(key)) {
          result.push(invoiceData[key]);
        }
      }
    }

    // Join all collected invoice numbers with commas
    return result.join(',');
  }


};



