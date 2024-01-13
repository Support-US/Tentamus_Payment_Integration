/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { API } from "aws-amplify";
import { createPaymentDetails } from "../graphql/mutations";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
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
    InvoiceNumbers: [],
    TransactionID: "",
    MerchantID: "",
    PaymentId: "",
    SAPBankPaymentAdviceId: "",
    createdAt: "",
    updatedAt: "",
    SecretValue1: "",
    SecretValue2: "",
    OdataUsername: "",
    OdataPassword: "",
  };
  const [FirstName, setFirstName] = React.useState(initialValues.FirstName);
  const [LastName, setLastName] = React.useState(initialValues.LastName);
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
  const [TransactionID, setTransactionID] = React.useState(
    initialValues.TransactionID
  );
  const [MerchantID, setMerchantID] = React.useState(initialValues.MerchantID);
  const [PaymentId, setPaymentId] = React.useState(initialValues.PaymentId);
  const [SAPBankPaymentAdviceId, setSAPBankPaymentAdviceId] = React.useState(
    initialValues.SAPBankPaymentAdviceId
  );
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [SecretValue1, setSecretValue1] = React.useState(
    initialValues.SecretValue1
  );
  const [SecretValue2, setSecretValue2] = React.useState(
    initialValues.SecretValue2
  );
  const [OdataUsername, setOdataUsername] = React.useState(
    initialValues.OdataUsername
  );
  const [OdataPassword, setOdataPassword] = React.useState(
    initialValues.OdataPassword
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setFirstName(initialValues.FirstName);
    setLastName(initialValues.LastName);
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
    setCurrentInvoiceNumbersValue("");
    setTransactionID(initialValues.TransactionID);
    setMerchantID(initialValues.MerchantID);
    setPaymentId(initialValues.PaymentId);
    setSAPBankPaymentAdviceId(initialValues.SAPBankPaymentAdviceId);
    setCreatedAt(initialValues.createdAt);
    setUpdatedAt(initialValues.updatedAt);
    setSecretValue1(initialValues.SecretValue1);
    setSecretValue2(initialValues.SecretValue2);
    setOdataUsername(initialValues.OdataUsername);
    setOdataPassword(initialValues.OdataPassword);
    setErrors({});
  };
  const [currentInvoiceNumbersValue, setCurrentInvoiceNumbersValue] =
    React.useState("");
  const InvoiceNumbersRef = React.createRef();
  const validations = {
    FirstName: [{ type: "Required" }],
    LastName: [{ type: "Required" }],
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
    InvoiceNumbers: [],
    TransactionID: [{ type: "Required" }],
    MerchantID: [],
    PaymentId: [],
    SAPBankPaymentAdviceId: [],
    createdAt: [],
    updatedAt: [],
    SecretValue1: [],
    SecretValue2: [],
    OdataUsername: [],
    OdataPassword: [],
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
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
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
          TransactionID,
          MerchantID,
          PaymentId,
          SAPBankPaymentAdviceId,
          createdAt,
          updatedAt,
          SecretValue1,
          SecretValue2,
          OdataUsername,
          OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              InvoiceNumbers: values,
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
            };
            const result = onChange(modelFields);
            values = result?.InvoiceNumbers ?? values;
          }
          setInvoiceNumbers(values);
          setCurrentInvoiceNumbersValue("");
        }}
        currentFieldValue={currentInvoiceNumbersValue}
        label={"Invoice numbers"}
        items={InvoiceNumbers}
        hasError={errors?.InvoiceNumbers?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("InvoiceNumbers", currentInvoiceNumbersValue)
        }
        errorMessage={errors?.InvoiceNumbers?.errorMessage}
        setFieldValue={setCurrentInvoiceNumbersValue}
        inputFieldRef={InvoiceNumbersRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Invoice numbers"
          isRequired={false}
          isReadOnly={false}
          value={currentInvoiceNumbersValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.InvoiceNumbers?.hasError) {
              runValidationTasks("InvoiceNumbers", value);
            }
            setCurrentInvoiceNumbersValue(value);
          }}
          onBlur={() =>
            runValidationTasks("InvoiceNumbers", currentInvoiceNumbersValue)
          }
          errorMessage={errors.InvoiceNumbers?.errorMessage}
          hasError={errors.InvoiceNumbers?.hasError}
          ref={InvoiceNumbersRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "InvoiceNumbers")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Transaction id"
        isRequired={true}
        isReadOnly={false}
        value={TransactionID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              TransactionID: value,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
            };
            const result = onChange(modelFields);
            value = result?.TransactionID ?? value;
          }
          if (errors.TransactionID?.hasError) {
            runValidationTasks("TransactionID", value);
          }
          setTransactionID(value);
        }}
        onBlur={() => runValidationTasks("TransactionID", TransactionID)}
        errorMessage={errors.TransactionID?.errorMessage}
        hasError={errors.TransactionID?.hasError}
        {...getOverrideProps(overrides, "TransactionID")}
      ></TextField>
      <TextField
        label="Merchant id"
        isRequired={false}
        isReadOnly={false}
        value={MerchantID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              TransactionID,
              MerchantID: value,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
            };
            const result = onChange(modelFields);
            value = result?.MerchantID ?? value;
          }
          if (errors.MerchantID?.hasError) {
            runValidationTasks("MerchantID", value);
          }
          setMerchantID(value);
        }}
        onBlur={() => runValidationTasks("MerchantID", MerchantID)}
        errorMessage={errors.MerchantID?.errorMessage}
        hasError={errors.MerchantID?.hasError}
        {...getOverrideProps(overrides, "MerchantID")}
      ></TextField>
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
              TransactionID,
              MerchantID,
              PaymentId: value,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
        label="Sap bank payment advice id"
        isRequired={false}
        isReadOnly={false}
        value={SAPBankPaymentAdviceId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId: value,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
            };
            const result = onChange(modelFields);
            value = result?.SAPBankPaymentAdviceId ?? value;
          }
          if (errors.SAPBankPaymentAdviceId?.hasError) {
            runValidationTasks("SAPBankPaymentAdviceId", value);
          }
          setSAPBankPaymentAdviceId(value);
        }}
        onBlur={() =>
          runValidationTasks("SAPBankPaymentAdviceId", SAPBankPaymentAdviceId)
        }
        errorMessage={errors.SAPBankPaymentAdviceId?.errorMessage}
        hasError={errors.SAPBankPaymentAdviceId?.hasError}
        {...getOverrideProps(overrides, "SAPBankPaymentAdviceId")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt: value,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
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
        label="Updated at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={updatedAt && convertToLocal(new Date(updatedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt: value,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
      ></TextField>
      <TextField
        label="Secret value1"
        isRequired={false}
        isReadOnly={false}
        value={SecretValue1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1: value,
              SecretValue2,
              OdataUsername,
              OdataPassword,
            };
            const result = onChange(modelFields);
            value = result?.SecretValue1 ?? value;
          }
          if (errors.SecretValue1?.hasError) {
            runValidationTasks("SecretValue1", value);
          }
          setSecretValue1(value);
        }}
        onBlur={() => runValidationTasks("SecretValue1", SecretValue1)}
        errorMessage={errors.SecretValue1?.errorMessage}
        hasError={errors.SecretValue1?.hasError}
        {...getOverrideProps(overrides, "SecretValue1")}
      ></TextField>
      <TextField
        label="Secret value2"
        isRequired={false}
        isReadOnly={false}
        value={SecretValue2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2: value,
              OdataUsername,
              OdataPassword,
            };
            const result = onChange(modelFields);
            value = result?.SecretValue2 ?? value;
          }
          if (errors.SecretValue2?.hasError) {
            runValidationTasks("SecretValue2", value);
          }
          setSecretValue2(value);
        }}
        onBlur={() => runValidationTasks("SecretValue2", SecretValue2)}
        errorMessage={errors.SecretValue2?.errorMessage}
        hasError={errors.SecretValue2?.hasError}
        {...getOverrideProps(overrides, "SecretValue2")}
      ></TextField>
      <TextField
        label="Odata username"
        isRequired={false}
        isReadOnly={false}
        value={OdataUsername}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername: value,
              OdataPassword,
            };
            const result = onChange(modelFields);
            value = result?.OdataUsername ?? value;
          }
          if (errors.OdataUsername?.hasError) {
            runValidationTasks("OdataUsername", value);
          }
          setOdataUsername(value);
        }}
        onBlur={() => runValidationTasks("OdataUsername", OdataUsername)}
        errorMessage={errors.OdataUsername?.errorMessage}
        hasError={errors.OdataUsername?.hasError}
        {...getOverrideProps(overrides, "OdataUsername")}
      ></TextField>
      <TextField
        label="Odata password"
        isRequired={false}
        isReadOnly={false}
        value={OdataPassword}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              FirstName,
              LastName,
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
              TransactionID,
              MerchantID,
              PaymentId,
              SAPBankPaymentAdviceId,
              createdAt,
              updatedAt,
              SecretValue1,
              SecretValue2,
              OdataUsername,
              OdataPassword: value,
            };
            const result = onChange(modelFields);
            value = result?.OdataPassword ?? value;
          }
          if (errors.OdataPassword?.hasError) {
            runValidationTasks("OdataPassword", value);
          }
          setOdataPassword(value);
        }}
        onBlur={() => runValidationTasks("OdataPassword", OdataPassword)}
        errorMessage={errors.OdataPassword?.errorMessage}
        hasError={errors.OdataPassword?.hasError}
        {...getOverrideProps(overrides, "OdataPassword")}
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
