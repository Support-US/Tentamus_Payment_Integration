import React, { useEffect, useState } from 'react';
import { Grid, TextField, FormControl, Autocomplete, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Field, Formik } from 'formik';
import './CustomerPaymentDetailsForm.css';
import { API } from 'aws-amplify';
import cc from 'currency-codes'
import { PaymentDetailsCreate } from '../../graphql/mutations';
import { BlowfishEncryption } from '../../Components/BlowfishEncryption';
import { Country, State } from 'country-state-city';
import { useDispatch, useSelector } from 'react-redux';
import { selectFormData, updateFormData } from '../../Store/Slice/formSlice';
import { HmacSHA256, enc } from 'crypto-js';
// import CryptoJS from 'crypto-js';
import MuiPhoneNumber from 'mui-phone-number';
import AFLLogo from "../../images/AFL_Logo.png";
// import mylogo from "../../images/3.png";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../../Components/ToastUtils';

const newcountries = Country.getAllCountries();
const currency = cc.codes();

const CustomerPaymentDetailsForm = () => {
  const [dropdowncountries, setDropdowncountries] = useState([]);
  const [dropdownCurrencies, setDropdownCurrencies] = useState([]);
  const [states, setStates] = useState([]);
  const dispatch = useDispatch();
  const initialValues = useSelector(selectFormData);
  const [hmacKey, setHmacKey] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    MerchantID: "",
    TransactionID: "",
    CalculatedHMAC: "",
    EncryptedString: "",
    dataLength: ""
  });
  const [combinedInvoices, setCombinedInvoices] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const usStates = State.getStatesOfCountry('US');
    setStates(usStates.map((state) => ({ name: state.name, isoCode: state.isoCode })));

    const countryArray = newcountries.map(country => {
      // console.log("country",country);
      return {
        countryName: country.name,
        countryCode: country.isoCode
      };
    });

    setDropdowncountries(countryArray);

    const currencyArray = currency.map(code => {
      // console.log("Currency",currency);
      return {
        label: code,
        value: code
      };
    });
    setDropdownCurrencies(currencyArray);
  }, []);

  // useEffect(() => {
  //   if (paymentDetails) {
  //     generateHMAC(paymentDetails);
  //   }
  // }, [paymentDetails]);

  useEffect(() => {
    if (paymentDetails.MerchantID !== "") {
      handleComputopRedirection(
        paymentDetails
      );
    }
  }, [paymentDetails]);

  const validateFirstName = (value) => {

    let error;
    const lettersOnlyRegex = /^[a-zA-Z]+$/;

    if (!value || value.trim().length === 0) {
      error = "Field is required";
      return error;
    } else if (!lettersOnlyRegex.test(value)) {
      error = " Enter a valid name with only letters"
      return error;
    }
    return error;
  }

  const validateLastName = (value) => {
    let error;
    const lettersOnlyRegex = /^[a-zA-Z]+$/;

    if (!value || value.trim().length === 0) {
      error = "Field is required";
    } else if (!lettersOnlyRegex.test(value)) {
      error = " Enter a valid name with only letters"
    }
    return error;
  }

  const validateCompanyName = (value) => {
    let error;
    // const lettersOnlyRegex = /^[a-zA-Z]+$/;
    const lettersOnlyRegex = /^[a-zA-Z\s]+$/;

    if (!value || value.trim().length === 0) {
      error = "Field is required";
    } else if (!lettersOnlyRegex.test(value)) {
      error = " Enter a valid name with only letters"
    }
    return error;
  }

  const validateEmail = (value) => {
    let error;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value || value.trim().length === 0) {
      error = "Field is required";
    } else if (!emailRegex.test(value)) {
      error = "Enter a valid email address";
    }
    return error;
  }

  const validateAddressLine1 = (value) => {
    let error;
    if (!value || value.trim().length === 0) {
      error = "Field is required";
    }
    return error;
  }

  const validateCountry = (value) => {
    let error;
    if (!value) {
      error = "Field is required";
    }
    return error
  }

  const validateState = (value) => {
    let error;
    if (!value || value.trim() === '') {
      error = "Field is required";
    }
    return error;
  };

  const validatePostalCode = (value) => {
    let error;
    if (!value) {
      error = "Field is required";
    } else if (!/^\d+$/.test(value)) {
      error = "Please enter a valid postal code";
    }
    return error;
  };

  const validatePhoneNumber = (value) => {
    let error;
    if (!value) {
      error = "Field is required";
    } else if (!value || value.length < 7) {
      error = "Please enter a valid phone number.";
    }
    return error
  }

  const validateAmount = (value) => {
    let error;
    if (!value) {
      error = "Field is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      error = "Please enter a valid amount with only 2 decimals";
    }
    return error
  }

  const validateCurrency = (value) => {
    let error;
    if (!value) {
      error = "Field is required";
    }
    return error
  }

  // const validateInvoice = (values, index) => {
  //   // console.log("Inside", values, index);
  //   let error;
  //   if (!values[index] && values && index) {
  //     error = `Invoice No ${index + 1} is required`;
  //   }
  //   return error;
  // };

  // const validateTextFields = () => {
  //   for (let i = 0; i < textFields.length; i++) {
  //     if (!textFields[i].trim()) {
  //       return `Invoice No ${i + 1} is required`;
  //     }
  //   }
  //   return null;
  // };

  const handleComputopRedirection = (paymentDetails) => {
    console.log("handleComputopRedirection", initialValues);
    const { MerchantID, CalculatedHMAC, EncryptedString, TransactionID, dataLength } = paymentDetails;
    const { FirstName, LastName, Amount, Currency, AddressLine1, City, State, Country, PhoneNumber, PostalCode } = initialValues;
    localStorage.setItem("EncryptedString", EncryptedString);

    // let amountInCents = parseFloat(Amount)*100; //Amount in cents

    // const successURL = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/success`;
    // const failureURL = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/error`;
    // const notifyURL = 'https://8j54xrirvb.execute-api.us-east-2.amazonaws.com/dev/webhook';

    // let dataToEncrypt = `MerchantID=${MerchantID}&TransID=${id}&Currency=${Currency}&Amount=${Amount}&MAC=${hmacKey}&URLNotify=${notifyURL}&URLSuccess=${successURL}&URLFailure=${failureURL}`;
    // let dataToEncrypt = `MerchantID=Tentamus_Adamson_test&TransID=1234&Currency=USD&Amount=22&MAC=3dd7ef66c092e4d5851291db13a809eb93defd167c99e3bc85b4c5365f3cdbe4&URLNotify=https://8j54xrirvb.execute-api.us-east-2.amazonaws.com/dev/webhook&URLSuccess=http://localhost:3000/success&URLFailure=http://localhost:3000/error`;

    // console.log("dataToEncrypt", dataToEncrypt);
    // alert(JSON.stringify(dataToEncrypt));
    // Working
    // let dataToEncrypt = `MerchantID=Tentamus_Adamson_test&TransID=dceb13cf-9692-4772-b18f-38332d4c3cdd&Currency=USD&Amount=22&MAC=3dd7ef66c092e4d5851291db13a809eb93defd167c99e3bc85b4c5365f3cdbe4&URLNotify=https://8j54xrirvb.execute-api.us-east-2.amazonaws.com/dev/webhook&URLSuccess=http://localhost:3000/success&URLFailure=http://localhost:3000/error`;
    // const computopDataParameter = BlowfishEncryption(dataToEncrypt, EncryptionPassword);

    // const merchantID = 'Generic3DSTest';
    const backgroundURL = 'https://www.tentamus.com/wp-content/uploads/2021/03/about_us_tentamus_fahnen_IMG_0722-2799x1679.jpg';
    const timestampInMilliseconds = new Date().getTime();
    localStorage.setItem("timestamp", timestampInMilliseconds);

    // console.log("DATA", dataToEncrypt);
    // console.log("DATA-LENGTH", dataToEncrypt.length);

    // alert(JSON.stringify(dataToEncrypt));
    // alert(JSON.stringify(dataToEncrypt.length));
    // alert(JSON.stringify(hmacKey));

    setLoading(false);
    // alert(`https://www.computop-paygate.com/payssl.aspx?MerchantID=${MerchantID}&Len=${dataLength}&Data=${EncryptedString}&CustomField1=${Amount} ${Currency}&CustomField3=https://www.afltexas.com/wp-content/uploads/2022/07/AFL_GroupTag.svg&CustomField4=${combinedInvoices}&CustomField5=${FirstName} ${LastName}%0A ${AddressLine1}%0A ${City}%0A ${PostalCode}%0A ${State}%0A ${Country}%0A ${PhoneNumber}&CustomField7=${TransactionID}`);
    window.location.href = `https://www.computop-paygate.com/payssl.aspx?MerchantID=${MerchantID}&Len=${dataLength}&Data=${EncryptedString}&CustomField1=${Amount} ${Currency}&CustomField3=https://www.afltexas.com/wp-content/uploads/2022/07/AFL_GroupTag.svg&CustomField4=${combinedInvoices}&CustomField5=${FirstName} ${LastName}%0A ${AddressLine1}%0A ${City}%0A ${State}%0A  ${PostalCode}%0A ${Country}%0A ${PhoneNumber}&CustomField7=${TransactionID}`;

  }

  // const generateHMAC = (data) => {
  //   const apiData = data;
  //   const secretKey = paymentDetails.HMacPassword;
  //   const message = `*${apiData.id}*${apiData.MerchantID}*${apiData.Amount}*${apiData.Currency}`;

  //   console.log("Message", message, "secretKey", secretKey);

  //   const hash = HmacSHA256(message, secretKey);
  //   const hashInHex = hash.toString(enc.Hex);
  //   console.log("hashInHex---", hashInHex);
  //   setHmacKey(hashInHex);
  // }

  const postPaymentDetails = async (data, resetForm) => {
    console.log("data", data);
    setLoading(true);
    try {
      // let das = "48E71E2D68A4971979BFFF3C2FE75BEDC9163BE6A9538D0B397FB1DDB762EC6C36E917369DDD26010BBE18716EB4C3AFBB4DBC48F79718B365C047B4402C62B1D48486DDE6FF56D8DB2AC42AA355DB1D90726724545A3A59AEAB97B0BBAF73BD649CD61FD5EA166FA7E5DF2277153BD8C68AAEFEA2F25F19D0F69F4EC7C397EB5DF696B7986D6604771285ED81A59C03E197F64135F059977DEF134D5D6125AFC01B2652A9ED235533718B50A484CD33CABFD79FC2DB94BA5FE60BD9D8C476C82893BA5DAF0A07B344BEE4FF9C70750314B5A0322A7685DBE1119EB2EE1B8CB79A60A0E4D8CB49F97C752057CFFF141ED76669E9915086070299923BE036DC9ABE4F5F99705382E8459EEA077B5731CE1F33B76F9FDAA1CB3D0B2A8ED4E54CFB48080DF595DC926EB8D495FEBDA2D957809612B6C0F83DDD&TransID=dceb13cf-9692-4772-b18f-38332d4c3cdd";
      // window.location.href = `https://www.computop-paygate.com/payssl.aspx?MerchantID=Tentamus_Adamson_test&Len=306&Data=${das}&CustomField1=200 USD&CustomField3=https://www.afltexas.com/wp-content/uploads/2022/07/AFL_GroupTag.svg&CustomField4=INV-001 %0AInv-002&CustomField5=John Doe%0A Newyork%0A United States&CustomField7=12121dasda22`;

      const response = await API.graphql(
        {
          query: PaymentDetailsCreate,
          variables: {
            input: data
          }
        }
      )
      console.log("GraphQL Response:", response);

      setPaymentDetails(prevState => ({
        ...prevState,
        TransactionID: response.data.PaymentDetailsCreate.TransactionID,
        MerchantID: response.data.PaymentDetailsCreate.MerchantID,
        CalculatedHMAC: response.data.PaymentDetailsCreate.CalculatedHMAC,
        EncryptedString: response.data.PaymentDetailsCreate.EncryptedString,
        dataLength: response.data.PaymentDetailsCreate.Length,
      }));

      localStorage.setItem("Tid", data.id);
      localStorage.setItem("Amount", data.Amount);
      localStorage.setItem("Currency", data.Currency);
      localStorage.setItem("Tid", data.id);

      resetForm();
      setTextFields(['']);
      setTouchedFields([false]);
      setLoading(false);

      // if (hmacKey !== '') {
      //   // Computop redirection
      //   handleComputopRedirection(response.data.createPaymentDetails.Currency, response.data.createPaymentDetails.Amount, response.data.createPaymentDetails.id);
      // }

    }
    catch (error) {
      setLoading(false);
      console.log("createPaymentDetails error", error);
      showToast("Something went wrong. Please try again", "error");
    }
  }


  const handleFormSubmit = async (values, { resetForm }) => {
    console.log("handleFormSubmit", values, textFields);
    console.log("textFields", textFields);
    // if (textFields[0] === "") {

    //   showToast(" Invoice Field is required", "Validation")
    // }
    if (textFields.some((field) => field === "")) {
      showToast(" Invoice Field is required", "Validation");
    }
    else {
      setCombinedInvoices(textFields.join("%0A"));

      const formattedInvoiceNumbers = textFields.map((value) => ({ InvoiceNo: value }));

      console.log("formattedInvoiceNumbers", formattedInvoiceNumbers);

      const formData = {
        ...values,
        InvoiceNumbers: JSON.stringify(formattedInvoiceNumbers)
      }
      console.log("formData", formData)

      try {
        const updatedFormData = {
          ...formData,
          Amount: formData.Amount.toString(),
        };

        dispatch(updateFormData(updatedFormData));

        await postPaymentDetails(updatedFormData, resetForm);



      }
      catch (error) {
        console.error("Create Payment Details error", error);
        throw error;
      }
    }

  }

  const handleTotalResetForm = (handleReset) => {
    handleReset();
    setTextFields(['']);
    setTouchedFields([false]);

  };

  const [textFields, setTextFields] = useState(['']); // Initialize with one empty string
  const [touchedFields, setTouchedFields] = useState([false]);


  const handleAddTextField = () => {
    setTextFields([...textFields, '']);
    setTouchedFields([...touchedFields, false]);
  };

  const handleRemoveTextField = (index) => {
    const updatedTextFields = [...textFields];
    updatedTextFields.splice(index, 1);
    setTextFields(updatedTextFields);

    const updatedTouchedFields = [...touchedFields];
    updatedTouchedFields.splice(index, 1);
    setTouchedFields(updatedTouchedFields);
  };

  const handleTextFieldChange = (index, value, handleChange) => {
    // console.log("HANDLE", value);
    // handleChange(`invoice[${index}]`, value);
    // if (value) {
    //   validateInvoice(`invoice[${index}]`, value);
    // }
    const updatedTextFields = [...textFields];
    updatedTextFields[index] = value;
    setTextFields(updatedTextFields);
  }

  const handleTextFieldBlur = (index) => {
    const updatedTouchedFields = [...touchedFields];
    updatedTouchedFields[index] = true;
    setTouchedFields(updatedTouchedFields);
  };




  return (
    <>
      <div>
        <ToastContainer />

        {loading && (
          <div class="overlay">
            <div class="overlay__inner">
              <div class="overlay__content"><span class="spinner"></span></div>
            </div>
          </div>
        )}

        <div className='card-container' style={{ border: "1px solid #007640" }}>
          <div>
            <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
              {({ values, handleSubmit, handleReset, handleChange, errors, touched, setFieldValue }) => (

                <form className='form-container'>
                  <Grid>
                    {/* Heading */}
                    <div className='flex justify-content-center align-items-center gap-3 sm:gap-5' style={{ textAlign: 'center' }}>
                      <img src={AFLLogo} style={{ width: '50px', height: 'auto' }} alt='AFL Logo' />
                      <span className='text-center'>
                        Analytical Food Laboratories
                      </span>
                    </div>
                    <div>
                      <span className='text-xs sm:text-lg font-semibold'>
                        Payment Details
                      </span>
                    </div>
                    <Grid container spacing={2} style={{ marginTop: "1px" }}>

                      {/* First Name */}
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="FirstName"
                            type="text"
                            as={TextField}
                            label="First Name *"
                            helperText={(touched.FirstName && errors.FirstName)}
                            error={touched.FirstName && Boolean(errors.FirstName)}
                            value={values.FirstName}
                            validate={validateFirstName}
                          />
                        </FormControl>
                      </Grid>

                      {/* last Name */}
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="LastName"
                            type="text"
                            as={TextField}
                            label="Last Name *"
                            helperText={(touched.LastName && errors.LastName)}
                            error={touched.LastName && Boolean(errors.LastName)}
                            value={values.LastName}
                            validate={validateLastName}
                          />
                        </FormControl>
                      </Grid>

                      {/* Company Name*/}
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="CompanyName"
                            type="text"
                            as={TextField}
                            label="Company Name *"
                            helperText={(touched.CompanyName && errors.CompanyName)}
                            error={touched.CompanyName && Boolean(errors.CompanyName)}
                            value={values.CompanyName}
                            validate={validateCompanyName}
                          />
                        </FormControl>
                      </Grid>

                      {/* Email */}
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="Email"
                            type="text"
                            as={TextField}
                            label="Email *"
                            helperText={(touched.Email && errors.Email)}
                            error={touched.Email && Boolean(errors.Email)}
                            value={values.Email}
                            validate={validateEmail}
                          />
                        </FormControl>
                      </Grid>

                      {/* address Line 1 */}
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="AddressLine1"
                            type="text"
                            as={TextField}
                            label="Address Line 1 *"
                            helperText={(touched.AddressLine1 && errors.AddressLine1)}
                            error={touched.AddressLine1 && Boolean(errors.AddressLine1)}
                            value={values.AddressLine1}
                            validate={validateAddressLine1}
                          />
                        </FormControl>
                      </Grid>

                      {/* address Line 2 */}
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="AddressLine2"
                            type="text"
                            as={TextField}
                            label="Address Line 2"
                          />
                        </FormControl>
                      </Grid>

                      {/* Country */}
                      <Grid item xs={4}>
                        <div className='field-container'>
                          <FormControl fullWidth>
                            <Field name="Country"
                              validate={validateCountry}
                              onChange={handleChange}
                              validateOnBlur
                              validateOnChange
                            >
                              {({ field, form }) => (
                                <Autocomplete
                                  size="small"
                                  options={dropdowncountries}
                                  getOptionLabel={(option) => option.countryName}
                                  value={dropdowncountries.find(
                                    (option) => option.countryCode === field.value
                                  ) || null
                                  }
                                  onChange={(event, value) => {
                                    if (value !== null) {
                                      setStates(State.getStatesOfCountry(value.countryCode));
                                    }
                                    form.setFieldValue(
                                      "Country",
                                      value?.countryCode || "");
                                  }}
                                  onBlur={() => form.setFieldTouched("Country", true)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Country *"
                                      variant="outlined"
                                      helperText={(touched.Country && errors.Country)}
                                      error={touched.Country && Boolean(errors.Country)} />
                                  )}
                                >
                                </Autocomplete>
                              )}
                            </Field>
                          </FormControl>
                        </div>
                      </Grid>

                      {/* State */}
                      <Grid item xs={4}>
                        <div className='field-container'>
                          <FormControl fullWidth>
                            <Field name="State"
                              validate={validateState}
                              onChange={handleChange}
                              validateOnBlur
                              validateOnChange
                            >
                              {({ field, form }) => (
                                <Autocomplete
                                  size="small"
                                  options={states}
                                  getOptionLabel={(option) => option.name}
                                  value={states.find(
                                    (option) => option.name === field.value)
                                    || null
                                  }
                                  onChange={(event, newValue) => {
                                    form.setFieldValue("State", newValue ? newValue.name : "");
                                  }}
                                  onBlur={() => form.setFieldTouched("State", true)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="State"
                                      variant="outlined"
                                      helperText={form.touched.State && form.errors.State}
                                      error={form.touched.State && Boolean(form.errors.State)}
                                    />
                                  )}
                                />

                              )}
                            </Field>
                          </FormControl>
                        </div>
                      </Grid>

                      {/* City */}
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="City"
                            type="text"
                            as={TextField}
                            label="City"
                          />
                        </FormControl>
                      </Grid>

                      {/* Postal Code */}
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="PostalCode"
                            type="text"
                            as={TextField}
                            label="Zip / Postal code *"
                            helperText={(touched.PostalCode && errors.PostalCode)}
                            error={touched.PostalCode && Boolean(errors.PostalCode)}
                            value={values.PostalCode}
                            validate={validatePostalCode}
                          />
                        </FormControl>
                      </Grid>

                      {/* Phone Number */}
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="PhoneNumber"
                            type="text"
                            as={MuiPhoneNumber}
                            variant="outlined"
                            label="Phone Number *"
                            onChange={(value) => setFieldValue("PhoneNumber", value)}
                            helperText={(touched.PhoneNumber && errors.PhoneNumber)}
                            error={touched.PhoneNumber && Boolean(errors.PhoneNumber)}
                            validate={validatePhoneNumber}


                          />
                        </FormControl>
                      </Grid>

                      {/* Amount */}
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <Field
                            size="small"
                            name="Amount"
                            type="number"
                            as={TextField}
                            label="Amount *"
                            helperText={(touched.Amount && errors.Amount)}
                            error={touched.Amount && Boolean(errors.Amount)}
                            value={values.Amount}
                            validate={validateAmount}
                          />
                        </FormControl>
                      </Grid>

                      {/* Currency */}
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <Field name="Currency"
                            validate={validateCurrency}
                            onChange={handleChange}
                          >
                            {({ field, form }) => (
                              <Autocomplete
                                size="small" options={dropdownCurrencies}
                                getOptionLabel={(option) => option.label}
                                value={dropdownCurrencies.find(
                                  (option) => option.value === field.value
                                ) || null
                                }
                                onChange={(event, value) => {
                                  form.setFieldValue(
                                    "Currency",
                                    value?.value || ""
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Currency *"
                                    variant='outlined'
                                    helperText={(touched.Currency && errors.Currency)}
                                    error={touched.Currency && Boolean(errors.Currency)}
                                  />
                                )}
                              >
                              </Autocomplete>
                            )}
                          </Field>
                        </FormControl>
                      </Grid>

                      {/* Invoice */}
                      {/* <Grid item xs={8}>
                      <div className='invoice-container'>
                        <div className='invoiceDetails'>
                          Invoice Details
                        </div>
                        <div>
                          <IconButton
                            size='small'
                            onClick={handleAddTextField}>
                            <AddIcon />
                          </IconButton>
                        </div>
                      </div>
                      {textFields.map((value, index) => (
                        <FormControl key={index} className='textFieldContainer'>
                          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                            <Field
                              name={`invoice[${index}]`}
                              style={{ marginBottom: '10px' }}
                              size="small"
                              as={TextField}
                              value={values.invoice[index]}
                              label={`Invoice No ${index + 1} *`}
                              // onChange={handleChange}
                              // onChange={(e) => {
                              //   handleTextFieldChange(index, e.target.value);
                              // }}
                              onChange={(e) => handleTextFieldChange(index, e.target.value, handleChange)}
                              helperText={(touched.invoice && touched.invoice[index] && errors.invoice && errors.invoice[index]) || ''}
                              error={(touched.invoice && touched.invoice[index] && Boolean(errors.invoice && errors.invoice[index])) || false}
                              // validate={validateInvoice}
                            />

                            {textFields.length > 1 && (
                              <IconButton size='small' onClick={() => handleRemoveTextField(index)}>
                                <RemoveIcon />
                              </IconButton>
                            )}

                          </div>
                        </FormControl>
                      ))}

                    </Grid> */}

                      {/* Invoice */}
                      <Grid item xs={6}>
                        <div className='invoice-container'>
                          <div className='text-xs sm:text-lg font-semibold'>
                            Invoice Details
                          </div>
                          <div>
                            <IconButton
                              size='small'
                              onClick={handleAddTextField}>
                              <AddIcon />
                            </IconButton>
                          </div>
                        </div>
                        {textFields.map((value, index) => (
                          <div key={index} className='textFieldContainer'>
                            <TextField
                              style={{ marginBottom: '10px' }}
                              size="small"
                              value={value}
                              label="Invoice No*"
                              onChange={(e) => handleTextFieldChange(index, e.target.value)}
                              onBlur={() => handleTextFieldBlur(index)}
                              error={touchedFields[index] && value.trim() === ''}  // Set error prop based on the condition
                              helperText={touchedFields[index] && value.trim() === '' ? 'Field is required' : ''}
                            />

                            {textFields.length > 1 && ( // Check if there is more than one text field
                              <IconButton size='small' onClick={() => handleRemoveTextField(index)}>
                                <RemoveIcon />
                              </IconButton>
                            )}
                          </div>
                        ))}
                      </Grid>

                      {/* Submit Button */}
                      <Grid item xs={12} sm={12} container justifyContent="flex-end">
                        <div className='field-container' style={{ display: 'flex', gap: '10px' }}>
                          <FormControl>
                            <Button
                              variant="outlined"
                              color="success"
                              size='small'
                              onClick={() => handleTotalResetForm(handleReset)}
                              style={{ textTransform: "capitalize", fontWeight: 600 }}
                            >
                              Cancel
                            </Button>
                          </FormControl>
                          <FormControl>
                            {
                              loading === true ?
                                <>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size='small'
                                    disableElevation
                                    disabled
                                    style={{ textTransform: "capitalize", fontWeight: 600 }}
                                  >
                                    Submitting...
                                  </Button>
                                </>
                                :
                                <>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size='small'
                                    disableElevation
                                    onClick={handleSubmit}
                                    style={{ textTransform: "capitalize", fontWeight: 600 }}
                                  >
                                    Submit
                                  </Button>
                                </>
                            }

                          </FormControl>
                        </div>
                      </Grid>
                    </Grid>

                  </Grid>
                </form>
              )}
            </Formik>
          </div>
        </div>
        {/* <div>
        <footer className="footer gap-1">
          <div style={{ fontSize: '12px' }}>
            Powered by
          </div>
          <img height={"20px"} width={"80px"} src={Nipurna}  alt="NipurnaImage" />
        </footer>
      </div> */}
      </div>
    </>
  );
};

export default CustomerPaymentDetailsForm;
