/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPaymentDetails = /* GraphQL */ `
  query GetPaymentDetails($id: ID!) {
    getPaymentDetails(id: $id) {
      FirstName
      LastName
      Address
      Email
      PhoneNumber
      InvoiceNumbers
      Status
      TransactionID
      MerchantID
      ReferenceNo
      Amount
      Currency
      BankPaymentAdviceId
      id
      createdAt
      updatedAt
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
        FirstName
        LastName
        Address
        Email
        PhoneNumber
        InvoiceNumbers
        Status
        TransactionID
        MerchantID
        ReferenceNo
        Amount
        Currency
        BankPaymentAdviceId
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
