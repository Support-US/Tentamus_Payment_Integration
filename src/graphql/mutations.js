/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPaymentDetails = /* GraphQL */ `
  mutation CreatePaymentDetails(
    $input: CreatePaymentDetailsInput!
    $condition: ModelPaymentDetailsConditionInput
  ) {
    createPaymentDetails(input: $input, condition: $condition) {
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
export const updatePaymentDetails = /* GraphQL */ `
  mutation UpdatePaymentDetails(
    $input: UpdatePaymentDetailsInput!
    $condition: ModelPaymentDetailsConditionInput
  ) {
    updatePaymentDetails(input: $input, condition: $condition) {
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
export const deletePaymentDetails = /* GraphQL */ `
  mutation DeletePaymentDetails(
    $input: DeletePaymentDetailsInput!
    $condition: ModelPaymentDetailsConditionInput
  ) {
    deletePaymentDetails(input: $input, condition: $condition) {
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
export const createUserCardDetails = /* GraphQL */ `
  mutation CreateUserCardDetails(
    $input: CreateUserCardDetailsInput!
    $condition: ModelUserCardDetailsConditionInput
  ) {
    createUserCardDetails(input: $input, condition: $condition) {
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
export const updateUserCardDetails = /* GraphQL */ `
  mutation UpdateUserCardDetails(
    $input: UpdateUserCardDetailsInput!
    $condition: ModelUserCardDetailsConditionInput
  ) {
    updateUserCardDetails(input: $input, condition: $condition) {
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
export const deleteUserCardDetails = /* GraphQL */ `
  mutation DeleteUserCardDetails(
    $input: DeleteUserCardDetailsInput!
    $condition: ModelUserCardDetailsConditionInput
  ) {
    deleteUserCardDetails(input: $input, condition: $condition) {
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
