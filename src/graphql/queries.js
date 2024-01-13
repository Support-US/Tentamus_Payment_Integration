/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPaymentDetails = /* GraphQL */ `
  query GetPaymentDetails($id: ID!) {
    getPaymentDetails(id: $id) {
      id
      FirstName
      LastName
      Email
      AddressLine1
      AddressLine2
      Country
      State
      City
      PostalCode
      PhoneNumber
      Amount
      Currency
      InvoiceNumbers
      TransactionID
      MerchantID
      PaymentId
      SAPBankPaymentAdviceId
      createdAt
      updatedAt
      SecretValue1
      SecretValue2
      OdataUsername
      OdataPassword
      __typename
    }
  }
`;
export const listPaymentDetails = /* GraphQL */ `
  query ListPaymentDetails(
    $filter: ModelPaymentDetailsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPaymentDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        FirstName
        LastName
        Email
        AddressLine1
        AddressLine2
        Country
        State
        City
        PostalCode
        PhoneNumber
        Amount
        Currency
        InvoiceNumbers
        TransactionID
        MerchantID
        PaymentId
        SAPBankPaymentAdviceId
        createdAt
        updatedAt
        SecretValue1
        SecretValue2
        OdataUsername
        OdataPassword
        __typename
      }
      nextToken
      __typename
    }
  }
`;
