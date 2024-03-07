/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { API } from "aws-amplify";
import { createPaymentDetails } from "../graphql/mutations";
export default function PaymentDetailsCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    FirstName: "",
    LastName: "",
    CompanyName: "",
    Email: "",
    AddressLine1: "",
    AddressLine2: "",
    Country: "",
    State: "",
    City: "",
    PostalCode: "",
    PhoneNumber: "",
    Amount: "",
    Currency: "",
    InvoiceNumbers: "",
    PaymentId: "",
    createdAt: "",
    PaymentStatus: "",
    CurrencyDecimalDigit: "",
    BeforePaymentSAPstatus: "",
    AfterPaymentSAPstatus: "",
    SAPErrorMessage: "",
    SAPObjectID: "",
    Description: "",
    PaymentMailStatus: "",
    SAPMailStatus: "",
    ClientName: "",
  };
  const [FirstName, setFirstName] = React.useState(initialValues.FirstName);
  const [LastName, setLastName] = React.useState(initialValues.LastName);
  const [CompanyName, setCompanyName] = React.useState(
    initialValues.CompanyName
  );
  const [Email, setEmail] = React.useState(initialValues.Email);
  const [AddressLine1, setAddressLine1] = React.useState(
    initialValues.AddressLine1
  );
  const [AddressLine2, setAddressLine2] = React.useState(
    initialValues.AddressLine2
  );
  const [Country, setCountry] = React.useState(initialValues.Country);
  const [State, setState] = React.useState(initialValues.State);
  const [City, setCity] = React.useState(initialValues.City);
  const [PostalCode, setPostalCode] = React.useState(initialValues.PostalCode);
  const [PhoneNumber, setPhoneNumber] = React.useState(
    initialValues.PhoneNumber
  );
  const [Amount, setAmount] = React.useState(initialValues.Amount);
  const [Currency, setCurrency] = React.useState(initialValues.Currency);
  const [InvoiceNumbers, setInvoiceNumbers] = React.useState(
    initialValues.InvoiceNumbers
  );
  const [PaymentId, setPaymentId] = React.useState(initialValues.PaymentId);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [PaymentStatus, setPaymentStatus] = React.useState(
    initialValues.PaymentStatus
  );
  const [CurrencyDecimalDigit, setCurrencyDecimalDigit] = React.useState(
    initialValues.CurrencyDecimalDigit
  );
  const [BeforePaymentSAPstatus, setBeforePaymentSAPstatus] = React.useState(
    initialValues.BeforePaymentSAPstatus
  );
  const [AfterPaymentSAPstatus, setAfterPaymentSAPstatus] = React.useState(
    initialValues.AfterPaymentSAPstatus
  );
  const [SAPErrorMessage, setSAPErrorMessage] = React.useState(
    initialValues.SAPErrorMessage
  );
  const [SAPObjectID, setSAPObjectID] = React.useState(
    initialValues.SAPObjectID
  );
  const [Description, setDescription] = React.useState(
    initialValues.Description
  );
  const [PaymentMailStatus, setPaymentMailStatus] = React.useState(
    initialValues.PaymentMailStatus
  );
  const [SAPMailStatus, setSAPMailStatus] = React.useState(
    initialValues.SAPMailStatus
  );
  const [ClientName, setClientName] = React.useState(initialValues.ClientName);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setFirstName(initialValues.FirstName);
    setLastName(initialValues.LastName);
    setCompanyName(initialValues.CompanyName);
    setEmail(initialValues.Email);
    setAddressLine1(initialValues.AddressLine1);
    setAddressLine2(initialValues.AddressLine2);
    setCountry(initialValues.Country);
    setState(initialValues.State);
    setCity(initialValues.City);
    setPostalCode(initialValues.PostalCode);
    setPhoneNumber(initialValues.PhoneNumber);
    setAmount(initialValues.Amount);
    setCurrency(initialValues.Currency);
    setInvoiceNumbers(initialValues.InvoiceNumbers);
    setPaymentId(initialValues.PaymentId);
    setCreatedAt(initialValues.createdAt);
    setPaymentStatus(initialValues.PaymentStatus);
    setCurrencyDecimalDigit(initialValues.CurrencyDecimalDigit);
    setBeforePaymentSAPstatus(initialValues.BeforePaymentSAPstatus);
    setAfterPaymentSAPstatus(initialValues.AfterPaymentSAPstatus);
    setSAPErrorMessage(initialValues.SAPErrorMessage);
    setSAPObjectID(initialValues.SAPObjectID);
    setDescription(initialValues.Description);
    setPaymentMailStatus(initialValues.PaymentMailStatus);
    setSAPMailStatus(initialValues.SAPMailStatus);
    setClientName(initialValues.ClientName);
    setErrors({});
  };
  const validations = {
    FirstName: [{ type: "Required" }],
    LastName: [{ type: "Required" }],
    CompanyName: [{ type: "Required" }],
    Email: [{ type: "Required" }],
    AddressLine1: [{ type: "Required" }],
    AddressLine2: [],
    Country: [{ type: "Required" }],
    State: [{ type: "Required" }],
    City: [],
    PostalCode: [{ type: "Required" }],
    PhoneNumber: [{ type: "Required" }],
    Amount: [{ type: "Required" }],
    Currency: [{ type: "Required" }],
    InvoiceNumbers: [{ type: "Required" }, { type: "JSON" }],
    PaymentId: [],
    createdAt: [],
    PaymentStatus: [{ type: "Required" }],
    CurrencyDecimalDigit: [],
    BeforePaymentSAPstatus: [],
    AfterPaymentSAPstatus: [],
    SAPErrorMessage: [],
    SAPObjectID: [],
    Description: [],
    PaymentMailStatus: [],
    SAPMailStatus: [],
    ClientName: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          FirstName,
          LastName,
          CompanyName,
          Email,
          AddressLine1,
          AddressLine2,
          Country,
          State,
          City,
          PostalCode,
          PhoneNumber,
          Amount,
          Currency,
          InvoiceNumbers,
          PaymentId,
          createdAt,
          PaymentStatus,
          CurrencyDecimalDigit,
          BeforePaymentSAPstatus,
          AfterPaymentSAPstatus,
          SAPErrorMessage,
          SAPObjectID,
          Description,
          PaymentMailStatus,
          SAPMailStatus,
          ClientName,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await API.graphql({
            query: createPaymentDetails.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "PaymentDetailsCreateForm")}
      {...rest}
    >
      <TextField
        label="First name"
        isRequired={true}
        isReadOnly={false}
        value={FirstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName: value,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.FirstName ?? value;
          }
          if (errors.FirstName?.hasError) {
            runValidationTasks("FirstName", value);
          }
          setFirstName(value);
        }}
        onBlur={() => runValidationTasks("FirstName", FirstName)}
        errorMessage={errors.FirstName?.errorMessage}
        hasError={errors.FirstName?.hasError}
        {...getOverrideProps(overrides, "FirstName")}
      ></TextField>
      <TextField
        label="Last name"
        isRequired={true}
        isReadOnly={false}
        value={LastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName: value,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.LastName ?? value;
          }
          if (errors.LastName?.hasError) {
            runValidationTasks("LastName", value);
          }
          setLastName(value);
        }}
        onBlur={() => runValidationTasks("LastName", LastName)}
        errorMessage={errors.LastName?.errorMessage}
        hasError={errors.LastName?.hasError}
        {...getOverrideProps(overrides, "LastName")}
      ></TextField>
      <TextField
        label="Company name"
        isRequired={true}
        isReadOnly={false}
        value={CompanyName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName: value,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.CompanyName ?? value;
          }
          if (errors.CompanyName?.hasError) {
            runValidationTasks("CompanyName", value);
          }
          setCompanyName(value);
        }}
        onBlur={() => runValidationTasks("CompanyName", CompanyName)}
        errorMessage={errors.CompanyName?.errorMessage}
        hasError={errors.CompanyName?.hasError}
        {...getOverrideProps(overrides, "CompanyName")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={true}
        isReadOnly={false}
        value={Email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email: value,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.Email ?? value;
          }
          if (errors.Email?.hasError) {
            runValidationTasks("Email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("Email", Email)}
        errorMessage={errors.Email?.errorMessage}
        hasError={errors.Email?.hasError}
        {...getOverrideProps(overrides, "Email")}
      ></TextField>
      <TextField
        label="Address line1"
        isRequired={true}
        isReadOnly={false}
        value={AddressLine1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1: value,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.AddressLine1 ?? value;
          }
          if (errors.AddressLine1?.hasError) {
            runValidationTasks("AddressLine1", value);
          }
          setAddressLine1(value);
        }}
        onBlur={() => runValidationTasks("AddressLine1", AddressLine1)}
        errorMessage={errors.AddressLine1?.errorMessage}
        hasError={errors.AddressLine1?.hasError}
        {...getOverrideProps(overrides, "AddressLine1")}
      ></TextField>
      <TextField
        label="Address line2"
        isRequired={false}
        isReadOnly={false}
        value={AddressLine2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2: value,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.AddressLine2 ?? value;
          }
          if (errors.AddressLine2?.hasError) {
            runValidationTasks("AddressLine2", value);
          }
          setAddressLine2(value);
        }}
        onBlur={() => runValidationTasks("AddressLine2", AddressLine2)}
        errorMessage={errors.AddressLine2?.errorMessage}
        hasError={errors.AddressLine2?.hasError}
        {...getOverrideProps(overrides, "AddressLine2")}
      ></TextField>
      <TextField
        label="Country"
        isRequired={true}
        isReadOnly={false}
        value={Country}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country: value,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.Country ?? value;
          }
          if (errors.Country?.hasError) {
            runValidationTasks("Country", value);
          }
          setCountry(value);
        }}
        onBlur={() => runValidationTasks("Country", Country)}
        errorMessage={errors.Country?.errorMessage}
        hasError={errors.Country?.hasError}
        {...getOverrideProps(overrides, "Country")}
      ></TextField>
      <TextField
        label="State"
        isRequired={true}
        isReadOnly={false}
        value={State}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State: value,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.State ?? value;
          }
          if (errors.State?.hasError) {
            runValidationTasks("State", value);
          }
          setState(value);
        }}
        onBlur={() => runValidationTasks("State", State)}
        errorMessage={errors.State?.errorMessage}
        hasError={errors.State?.hasError}
        {...getOverrideProps(overrides, "State")}
      ></TextField>
      <TextField
        label="City"
        isRequired={false}
        isReadOnly={false}
        value={City}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City: value,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.City ?? value;
          }
          if (errors.City?.hasError) {
            runValidationTasks("City", value);
          }
          setCity(value);
        }}
        onBlur={() => runValidationTasks("City", City)}
        errorMessage={errors.City?.errorMessage}
        hasError={errors.City?.hasError}
        {...getOverrideProps(overrides, "City")}
      ></TextField>
      <TextField
        label="Postal code"
        isRequired={true}
        isReadOnly={false}
        value={PostalCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode: value,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.PostalCode ?? value;
          }
          if (errors.PostalCode?.hasError) {
            runValidationTasks("PostalCode", value);
          }
          setPostalCode(value);
        }}
        onBlur={() => runValidationTasks("PostalCode", PostalCode)}
        errorMessage={errors.PostalCode?.errorMessage}
        hasError={errors.PostalCode?.hasError}
        {...getOverrideProps(overrides, "PostalCode")}
      ></TextField>
      <TextField
        label="Phone number"
        isRequired={true}
        isReadOnly={false}
        value={PhoneNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber: value,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.PhoneNumber ?? value;
          }
          if (errors.PhoneNumber?.hasError) {
            runValidationTasks("PhoneNumber", value);
          }
          setPhoneNumber(value);
        }}
        onBlur={() => runValidationTasks("PhoneNumber", PhoneNumber)}
        errorMessage={errors.PhoneNumber?.errorMessage}
        hasError={errors.PhoneNumber?.hasError}
        {...getOverrideProps(overrides, "PhoneNumber")}
      ></TextField>
      <TextField
        label="Amount"
        isRequired={true}
        isReadOnly={false}
        value={Amount}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount: value,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.Amount ?? value;
          }
          if (errors.Amount?.hasError) {
            runValidationTasks("Amount", value);
          }
          setAmount(value);
        }}
        onBlur={() => runValidationTasks("Amount", Amount)}
        errorMessage={errors.Amount?.errorMessage}
        hasError={errors.Amount?.hasError}
        {...getOverrideProps(overrides, "Amount")}
      ></TextField>
      <TextField
        label="Currency"
        isRequired={true}
        isReadOnly={false}
        value={Currency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency: value,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.Currency ?? value;
          }
          if (errors.Currency?.hasError) {
            runValidationTasks("Currency", value);
          }
          setCurrency(value);
        }}
        onBlur={() => runValidationTasks("Currency", Currency)}
        errorMessage={errors.Currency?.errorMessage}
        hasError={errors.Currency?.hasError}
        {...getOverrideProps(overrides, "Currency")}
      ></TextField>
      <TextAreaField
        label="Invoice numbers"
        isRequired={true}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers: value,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.InvoiceNumbers ?? value;
          }
          if (errors.InvoiceNumbers?.hasError) {
            runValidationTasks("InvoiceNumbers", value);
          }
          setInvoiceNumbers(value);
        }}
        onBlur={() => runValidationTasks("InvoiceNumbers", InvoiceNumbers)}
        errorMessage={errors.InvoiceNumbers?.errorMessage}
        hasError={errors.InvoiceNumbers?.hasError}
        {...getOverrideProps(overrides, "InvoiceNumbers")}
      ></TextAreaField>
      <TextField
        label="Payment id"
        isRequired={false}
        isReadOnly={false}
        value={PaymentId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId: value,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.PaymentId ?? value;
          }
          if (errors.PaymentId?.hasError) {
            runValidationTasks("PaymentId", value);
          }
          setPaymentId(value);
        }}
        onBlur={() => runValidationTasks("PaymentId", PaymentId)}
        errorMessage={errors.PaymentId?.errorMessage}
        hasError={errors.PaymentId?.hasError}
        {...getOverrideProps(overrides, "PaymentId")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={false}
        isReadOnly={false}
        value={createdAt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt: value,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <TextField
        label="Payment status"
        isRequired={true}
        isReadOnly={false}
        value={PaymentStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus: value,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.PaymentStatus ?? value;
          }
          if (errors.PaymentStatus?.hasError) {
            runValidationTasks("PaymentStatus", value);
          }
          setPaymentStatus(value);
        }}
        onBlur={() => runValidationTasks("PaymentStatus", PaymentStatus)}
        errorMessage={errors.PaymentStatus?.errorMessage}
        hasError={errors.PaymentStatus?.hasError}
        {...getOverrideProps(overrides, "PaymentStatus")}
      ></TextField>
      <TextField
        label="Currency decimal digit"
        isRequired={false}
        isReadOnly={false}
        value={CurrencyDecimalDigit}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit: value,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.CurrencyDecimalDigit ?? value;
          }
          if (errors.CurrencyDecimalDigit?.hasError) {
            runValidationTasks("CurrencyDecimalDigit", value);
          }
          setCurrencyDecimalDigit(value);
        }}
        onBlur={() =>
          runValidationTasks("CurrencyDecimalDigit", CurrencyDecimalDigit)
        }
        errorMessage={errors.CurrencyDecimalDigit?.errorMessage}
        hasError={errors.CurrencyDecimalDigit?.hasError}
        {...getOverrideProps(overrides, "CurrencyDecimalDigit")}
      ></TextField>
      <TextField
        label="Before payment sa pstatus"
        isRequired={false}
        isReadOnly={false}
        value={BeforePaymentSAPstatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus: value,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.BeforePaymentSAPstatus ?? value;
          }
          if (errors.BeforePaymentSAPstatus?.hasError) {
            runValidationTasks("BeforePaymentSAPstatus", value);
          }
          setBeforePaymentSAPstatus(value);
        }}
        onBlur={() =>
          runValidationTasks("BeforePaymentSAPstatus", BeforePaymentSAPstatus)
        }
        errorMessage={errors.BeforePaymentSAPstatus?.errorMessage}
        hasError={errors.BeforePaymentSAPstatus?.hasError}
        {...getOverrideProps(overrides, "BeforePaymentSAPstatus")}
      ></TextField>
      <TextField
        label="After payment sa pstatus"
        isRequired={false}
        isReadOnly={false}
        value={AfterPaymentSAPstatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus: value,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.AfterPaymentSAPstatus ?? value;
          }
          if (errors.AfterPaymentSAPstatus?.hasError) {
            runValidationTasks("AfterPaymentSAPstatus", value);
          }
          setAfterPaymentSAPstatus(value);
        }}
        onBlur={() =>
          runValidationTasks("AfterPaymentSAPstatus", AfterPaymentSAPstatus)
        }
        errorMessage={errors.AfterPaymentSAPstatus?.errorMessage}
        hasError={errors.AfterPaymentSAPstatus?.hasError}
        {...getOverrideProps(overrides, "AfterPaymentSAPstatus")}
      ></TextField>
      <TextField
        label="Sap error message"
        isRequired={false}
        isReadOnly={false}
        value={SAPErrorMessage}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage: value,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.SAPErrorMessage ?? value;
          }
          if (errors.SAPErrorMessage?.hasError) {
            runValidationTasks("SAPErrorMessage", value);
          }
          setSAPErrorMessage(value);
        }}
        onBlur={() => runValidationTasks("SAPErrorMessage", SAPErrorMessage)}
        errorMessage={errors.SAPErrorMessage?.errorMessage}
        hasError={errors.SAPErrorMessage?.hasError}
        {...getOverrideProps(overrides, "SAPErrorMessage")}
      ></TextField>
      <TextField
        label="Sap object id"
        isRequired={false}
        isReadOnly={false}
        value={SAPObjectID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID: value,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.SAPObjectID ?? value;
          }
          if (errors.SAPObjectID?.hasError) {
            runValidationTasks("SAPObjectID", value);
          }
          setSAPObjectID(value);
        }}
        onBlur={() => runValidationTasks("SAPObjectID", SAPObjectID)}
        errorMessage={errors.SAPObjectID?.errorMessage}
        hasError={errors.SAPObjectID?.hasError}
        {...getOverrideProps(overrides, "SAPObjectID")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={Description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description: value,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.Description ?? value;
          }
          if (errors.Description?.hasError) {
            runValidationTasks("Description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("Description", Description)}
        errorMessage={errors.Description?.errorMessage}
        hasError={errors.Description?.hasError}
        {...getOverrideProps(overrides, "Description")}
      ></TextField>
      <TextField
        label="Payment mail status"
        isRequired={false}
        isReadOnly={false}
        value={PaymentMailStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus: value,
              SAPMailStatus,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.PaymentMailStatus ?? value;
          }
          if (errors.PaymentMailStatus?.hasError) {
            runValidationTasks("PaymentMailStatus", value);
          }
          setPaymentMailStatus(value);
        }}
        onBlur={() =>
          runValidationTasks("PaymentMailStatus", PaymentMailStatus)
        }
        errorMessage={errors.PaymentMailStatus?.errorMessage}
        hasError={errors.PaymentMailStatus?.hasError}
        {...getOverrideProps(overrides, "PaymentMailStatus")}
      ></TextField>
      <TextField
        label="Sap mail status"
        isRequired={false}
        isReadOnly={false}
        value={SAPMailStatus}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus: value,
              ClientName,
            };
            const result = onChange(modelFields);
            value = result?.SAPMailStatus ?? value;
          }
          if (errors.SAPMailStatus?.hasError) {
            runValidationTasks("SAPMailStatus", value);
          }
          setSAPMailStatus(value);
        }}
        onBlur={() => runValidationTasks("SAPMailStatus", SAPMailStatus)}
        errorMessage={errors.SAPMailStatus?.errorMessage}
        hasError={errors.SAPMailStatus?.hasError}
        {...getOverrideProps(overrides, "SAPMailStatus")}
      ></TextField>
      <TextField
        label="Client name"
        isRequired={false}
        isReadOnly={false}
        value={ClientName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
              CompanyName,
              Email,
              AddressLine1,
              AddressLine2,
              Country,
              State,
              City,
              PostalCode,
              PhoneNumber,
              Amount,
              Currency,
              InvoiceNumbers,
              PaymentId,
              createdAt,
              PaymentStatus,
              CurrencyDecimalDigit,
              BeforePaymentSAPstatus,
              AfterPaymentSAPstatus,
              SAPErrorMessage,
              SAPObjectID,
              Description,
              PaymentMailStatus,
              SAPMailStatus,
              ClientName: value,
            };
            const result = onChange(modelFields);
            value = result?.ClientName ?? value;
          }
          if (errors.ClientName?.hasError) {
            runValidationTasks("ClientName", value);
          }
          setClientName(value);
        }}
        onBlur={() => runValidationTasks("ClientName", ClientName)}
        errorMessage={errors.ClientName?.errorMessage}
        hasError={errors.ClientName?.hasError}
        {...getOverrideProps(overrides, "ClientName")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
