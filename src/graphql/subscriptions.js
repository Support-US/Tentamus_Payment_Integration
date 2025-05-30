/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePaymentDetails = /* GraphQL */ `
  subscription OnCreatePaymentDetails(
    $filter: ModelSubscriptionPaymentDetailsFilterInput
  ) {
    onCreatePaymentDetails(filter: $filter) {
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
export const onUpdatePaymentDetails = /* GraphQL */ `
  subscription OnUpdatePaymentDetails(
    $filter: ModelSubscriptionPaymentDetailsFilterInput
  ) {
    onUpdatePaymentDetails(filter: $filter) {
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
export const onDeletePaymentDetails = /* GraphQL */ `
  subscription OnDeletePaymentDetails(
    $filter: ModelSubscriptionPaymentDetailsFilterInput
  ) {
    onDeletePaymentDetails(filter: $filter) {
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
export const onCreateUserCardDetails = /* GraphQL */ `
  subscription OnCreateUserCardDetails(
    $filter: ModelSubscriptionUserCardDetailsFilterInput
  ) {
    onCreateUserCardDetails(filter: $filter) {
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
export const onUpdateUserCardDetails = /* GraphQL */ `
  subscription OnUpdateUserCardDetails(
    $filter: ModelSubscriptionUserCardDetailsFilterInput
  ) {
    onUpdateUserCardDetails(filter: $filter) {
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
export const onDeleteUserCardDetails = /* GraphQL */ `
  subscription OnDeleteUserCardDetails(
    $filter: ModelSubscriptionUserCardDetailsFilterInput
  ) {
    onDeleteUserCardDetails(filter: $filter) {
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
