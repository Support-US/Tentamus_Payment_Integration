/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPaymentDetails = /* GraphQL */ `
  mutation CreatePaymentDetails(
    $input: CreatePaymentDetailsInput!
    $condition: ModelPaymentDetailsConditionInput
  ) {
    createPaymentDetails(input: $input, condition: $condition) {
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
export const updatePaymentDetails = /* GraphQL */ `
  mutation UpdatePaymentDetails(
    $input: UpdatePaymentDetailsInput!
    $condition: ModelPaymentDetailsConditionInput
  ) {
    updatePaymentDetails(input: $input, condition: $condition) {
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
export const deletePaymentDetails = /* GraphQL */ `
  mutation DeletePaymentDetails(
    $input: DeletePaymentDetailsInput!
    $condition: ModelPaymentDetailsConditionInput
  ) {
    deletePaymentDetails(input: $input, condition: $condition) {
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
