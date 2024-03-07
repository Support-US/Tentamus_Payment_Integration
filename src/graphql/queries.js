/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPaymentDetails = /* GraphQL */ `
  query GetPaymentDetails($id: ID!) {
    getPaymentDetails(id: $id) {
      id
      FirstName
      LastName
      CompanyName
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
      PaymentId
      createdAt
      PaymentStatus
      CurrencyDecimalDigit
      BeforePaymentSAPstatus
      AfterPaymentSAPstatus
      SAPErrorMessage
      SAPObjectID
      Description
      PaymentMailStatus
      SAPMailStatus
      ClientName
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
        id
        FirstName
        LastName
        CompanyName
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
        PaymentId
        createdAt
        PaymentStatus
        CurrencyDecimalDigit
        BeforePaymentSAPstatus
        AfterPaymentSAPstatus
        SAPErrorMessage
        SAPObjectID
        Description
        PaymentMailStatus
        SAPMailStatus
        ClientName
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
