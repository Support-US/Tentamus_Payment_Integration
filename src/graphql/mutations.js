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
      CardDetails
      updatedAt
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
      CardDetails
      updatedAt
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
      CardDetails
      updatedAt
      __typename
    }
  }
`;
