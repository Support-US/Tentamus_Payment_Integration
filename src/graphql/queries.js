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
      updatedAt
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
      ClientCompanyID
      MaskedCardNumber
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
        updatedAt
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
        ClientCompanyID
        MaskedCardNumber
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserCardDetails = /* GraphQL */ `
  query GetUserCardDetails($id: ID!) {
    getUserCardDetails(id: $id) {
      id
      Email
      cardHolderName
      cardBrand
      expiryDate
      pcnrNumber
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUserCardDetails = /* GraphQL */ `
  query ListUserCardDetails(
    $filter: ModelUserCardDetailsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserCardDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        Email
        cardHolderName
        cardBrand
        expiryDate
        pcnrNumber
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listCardsByEmail = /* GraphQL */ `
  query ListCardsByEmail(
    $Email: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserCardDetailsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCardsByEmail(
      Email: $Email
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Email
        cardHolderName
        cardBrand
        expiryDate
        pcnrNumber
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
