import React, { useEffect, useState } from 'react';
import { Grid, TextField, FormControl, Autocomplete, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Field, Formik } from 'formik';
import './CustomerPaymentDetailsForm.css';
// import { API } from 'aws-amplify';
// import cc from 'currency-codes'
// import { PaymentDetailsCreate } from '../../graphql/mutations';
import { Country, State } from 'country-state-city';
import { useDispatch, useSelector } from 'react-redux';
import { selectFormData, updateFormData } from '../../Store/Slice/formSlice';
// import CryptoJS from 'crypto-js';
import MuiPhoneNumber from 'mui-phone-number';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../../Components/ToastUtils';
import axios from 'axios';
import CurrencyFormat from '../../Components/CurrencyFormat';

import AFLLogo from "../../images/AFL_Logo.png";
import CFLLogo from "../../images/CFL_Logo.png";
import AdamsonLogo from "../../images/AdamsonLogo.png";
import TentamusLogo from "../../images/tentamus.png";

const currencyDecimalDigit = require('@mreduar/iso-4217-currencies');

const newcountries = Country.getAllCountries();
// const currency = cc.codes();

const CustomerPaymentDetailsForm = () => {
  const [dropdowncountries, setDropdowncountries] = useState([]);
  const [dropdownCurrencies, setDropdownCurrencies] = useState([]);
  const [states, setStates] = useState([]);
  const dispatch = useDispatch();
  const initialValues = useSelector(selectFormData);
  const [paymentDetails, setPaymentDetails] = useState({
    MerchantID: "",
    TransactionID: "",
    CalculatedHMAC: "",
    EncryptedString: "",
    dataLength: ""
  });
  const [combinedInvoices, setCombinedInvoices] = useState("");
  const [loading, setLoading] = useState(false);
  const [amountInUSD, setAmountInUSD] = useState(0);
  const [countryName, setCountryName] = useState("United States");

  useEffect(() => {
    const usStates = State.getStatesOfCountry('US');
    setStates(usStates.map((state) => ({ name: state.name, isoCode: state.isoCode })));

    const countryArray = newcountries.map(country => {
      return {
        countryName: country.name,
        countryCode: country.isoCode
      };
    });

    setDropdowncountries(countryArray);

    const currencyArray = [
      { label: 'EUR', value: 'EUR' },
      { label: 'GBP', value: 'GBP' },
      { label: 'INR', value: 'INR' },
      { label: 'JPY', value: 'JPY' },
      { label: 'USD', value: 'USD' },
    ];
    setDropdownCurrencies(currencyArray);
  }, []);


  //   const currencyArray = currency.map(code => {
  //     return {
  //       label: code,
  //       value: code
  //     };
  //   });
  //   setDropdownCurrencies(currencyArray);
  //   console.log("Currency", currencyArray);

  // }, []);



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

  const [srcLogo, setSrcLogo] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [logoStyle, setLogoStyle] = useState({ width: '80px', height: 'auto' });
  const [textStyle, setTextStyle] = useState({});
  const [clientname, setClientName] = useState("");
  const [clientcompanyid, setClientCompanyId] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");

  useEffect(() => {
    const path = window.location.pathname;
    const companyNameParam = path.split("/")[1];

    switch (companyNameParam) {
      case 'AnalyticalFoodLaboratories':
        setSrcLogo(AFLLogo);
        setCompanyName('Analytical Food Laboratories');
        setTextStyle({ marginTop: '0.5rem', textAlign: 'center' });
        setClientName("Analytical Food Laboratories");
        setClientCompanyId("C1304");
        setWebsiteURL("https://www.afltexas.com");
        break;

      case 'ColumbiaLaboratories':
        setSrcLogo(CFLLogo);
        setCompanyName('Columbia Laboratories');
        setLogoStyle({ width: '170px', height: 'auto' });
        setTextStyle({ marginTop: '1rem', textAlign: 'center' });
        setClientName("Columbia Laboratories");
        setClientCompanyId("C1301");
        setWebsiteURL("https://www.columbialaboratories.com");
        break;

      case 'TentamusNorthAmericaVirginia':
        setSrcLogo(TentamusLogo);
        setCompanyName('Tentamus North America Virginia');
        setLogoStyle({ width: '170px', height: 'auto' });
        setTextStyle({ marginTop: '1rem', textAlign: 'center' });
        setClientName("Tentamus North America Virginia");
        setClientCompanyId("C1303");
        setWebsiteURL("https://www.tentamus-va.com/");
        break;

      case 'AdamsonAnalyticalLabs':
        setSrcLogo(AdamsonLogo);
        setCompanyName('Adamson Analytical Labs');
        setLogoStyle({ width: '170px', height: 'auto' });
        setTextStyle({ marginTop: '1rem', textAlign: 'center' });
        setClientName("Adamson Analytical Labs");
        setClientCompanyId("C1302");
        setWebsiteURL("https://www.adamsonlab.com/");
        break;
    }

  }, []);

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
    } 
    // else if (!lettersOnlyRegex.test(value)) {
    //   error = " Enter a valid name with only letters"
    // }
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
    } else if (!/^\d+(\.\d{1,3})?$/.test(value)) {
      error = "Please enter a valid amount with only 3 decimals";
    }
    return error;
  };


  const validateCurrency = (value) => {
    let error;
    if (!value) {
      error = "Field is required";
    }
    return error
  }

  // const validateInvoice = (values, index) => {
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
    // console.log("handleComputopRedirection", initialValues);

    const { MerchantID, EncryptedString, TransactionID, dataLength } = paymentDetails;
    const { FirstName, LastName, Currency, AddressLine1, City, State, PhoneNumber, PostalCode } = initialValues;
    // const backgroundURL = 'https://www.tentamus.com/wp-content/uploads/2021/03/about_us_tentamus_fahnen_IMG_0722-2799x1679.jpg';
    setLoading(false);

    const customField3 =
      companyName === 'Analytical Food Laboratories'
        ? 'https://www.afltexas.com/wp-content/uploads/2022/07/AFL_GroupTag.svg'
        : companyName === 'Columbia Laboratories'
          ? 'https://www.columbialaboratories.com/wp-content/uploads/2022/09/CL_GroupTag_horizontal.svg'
          : companyName === 'Adamson Analytical Labs'
            ? 'https://www.adamsonlab.com/wp-content/uploads/2023/06/logo.svg'
            : companyName === 'Tentamus North America Virginia'
              ? 'https://www.tentamus.com/wp-content/uploads/2021/07/tentamus-group-logo.svg'
              : undefined;

    window.location.href = `https://www.computop-paygate.com/payssl.aspx?MerchantID=${MerchantID}&Len=${dataLength}&Data=${EncryptedString}&CustomField1=${CurrencyFormat(amountInUSD)} ${Currency}&CustomField3=${customField3}&CustomField4=${combinedInvoices}&CustomField5=${FirstName} ${LastName}%0A ${AddressLine1}%0A ${City}%0A ${State}%0A ${PostalCode}%0A ${countryName}%0A ${PhoneNumber}&CustomField7=${TransactionID}`;
    // window.location.href = `https://www.computop-paygate.com/payssl.aspx?MerchantID=${MerchantID}&Len=${dataLength}&Data=${EncryptedString}&CustomField1=${CurrencyFormat(amountInUSD)} ${Currency}&CustomField3=https://www.afltexas.com/wp-content/uploads/2022/07/AFL_GroupTag.svg&CustomField4=${combinedInvoices}&CustomField5=${FirstName} ${LastName}%0A ${AddressLine1}%0A ${City}%0A ${State}%0A ${PostalCode}%0A ${countryName}%0A ${PhoneNumber}&CustomField7=${TransactionID}`;
  }

  const postPaymentDetails = async (data, resetForm) => {
    console.log("data", data);
    setLoading(true);

    try {
      const response = await axios.post('https://42cjoeluv3.execute-api.us-east-2.amazonaws.com/dev/paymentDetails',
        JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      console.log(" API Response:", response)

      // const response = await API.graphql(
      //   {
      //     query: PaymentDetailsCreate,
      //     variables: {
      //       input: data
      //     },
      //   }
      // )
      // console.log("GraphQL Response:", response);

      setPaymentDetails(prevState => ({
        ...prevState,
        TransactionID: response.data.TransactionID,
        MerchantID: response.data.MerchantID,
        CalculatedHMAC: response.data.CalculatedHMAC,
        EncryptedString: response.data.EncryptedString,
        dataLength: response.data.Length,
      }));

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
    // console.log("handleFormSubmit", values, textFields);
    // console.log("textFields", textFields);

    const currencyDetails = currencyDecimalDigit.currency(values.Currency).decimalDigits;
    console.log("currencyDetails", currencyDetails);

    const amountEntered = values.Amount;
    console.log("amountEntered", amountEntered);

    // Extract the number of decimal digits entered
    const numberOfDecimalsEntered = (amountEntered.toString().split('.')[1] || []).length;

    // Convert currency details to an array if it's not already
    // const currencyDetailsArray = Array.isArray(currencyDetails) ? currencyDetails : [currencyDetails];

    // Check if the number of decimal digits entered is valid for the currency
    // const isValidDecimalDigits = numberOfDecimalsEntered <= Math.max(...currencyDetailsArray);
    const isValidDecimalDigits = numberOfDecimalsEntered <= currencyDetails;

    if (!isValidDecimalDigits) {
      if (currencyDetails === 0) {
        showToast(`${values.Currency} does not allow decimal digits`, 'error');
      }
      else {
        showToast(`${values.Currency} allows only ${currencyDetails} decimal digits`, 'error');
      }
    }
    else {
      if (textFields.some((field) => field === "")) {
        showToast(" Invoice Field is required", "Validation");
      }
      else {
        setCombinedInvoices(textFields.join("%0A"));


        const formattedInvoiceNumbers = textFields.map((value) => ({ InvoiceNo: value }));

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
        console.log("formattedDate", formattedDate);

        const formData = {
          ...values,
          InvoiceNumbers: formattedInvoiceNumbers,
          // InvoiceNumbers: JSON.stringify(formattedInvoiceNumbers)
          createdAt: formattedDate,
          ClientName: clientname,
          ClientCompanyID: clientcompanyid
        }
        console.log("formData", formData);

        try {
          // Multiplying amount based on smallest unit of currency
          const currencyDetails = currencyDecimalDigit.currency(values.Currency);
          const factor = Math.pow(10, currencyDetails.decimalDigits);
          const multipliedAmount = formData.Amount * factor;

          setAmountInUSD(formData.Amount);

          // Updating initialvalues
          const updatedFormData = {
            ...formData,
            Amount: multipliedAmount,
            CurrencyDecimalDigit: currencyDetails.decimalDigits
          };

          dispatch(updateFormData(updatedFormData));

          // Graphql API for creating payment details
          await postPaymentDetails(updatedFormData, resetForm);
        }
        catch (error) {
          console.error("Create Payment Details error", error);
          throw error;
        }
      }
    }

  }

  const handleTotalResetForm = (handleReset) => {
    handleReset();
    setTextFields(['']);
    setTouchedFields([false]);
  };

  const [textFields, setTextFields] = useState(['']);
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
          <div className="overlay">
            <div className="overlay__inner">
              <div className="overlay__content"><span className="spinner"></span></div>
            </div>
          </div>
        )}

        <div className='card-container'>
          <div>
            <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
              {({ values, handleSubmit, handleReset, handleChange, errors, touched, setFieldValue }) => (

                <form className='form-container'>
                  <Grid>
                    {/* Heading */}
                    <div className='flex justify-content-center align-items-center gap-3 sm:gap-5' style={{ textAlign: 'center' }}>
                      {srcLogo && (
                        <a href={websiteURL} target="_blank" rel="noopener noreferrer">
                          <img src={srcLogo} style={logoStyle} alt={`${companyName} Logo`} />
                        </a>
                      )}
                      <span style={textStyle} className='text-center'>
                        {companyName}
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
                            placeholder={!values.FirstName ? " First Name *" : ""}
                            label={values.FirstName ? "First Name *" : ""}
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
                            placeholder={!values.LastName ? "Last Name *" : ""}
                            label={values.LastName ? "Last Name *" : ""}
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
                            placeholder={!values.CompanyName ? "Company Name *" : ""}
                            label={values.CompanyName ? "Company Name *" : ""}
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
                            placeholder={!values.Email ? "Email *" : ""}
                            label={values.Email ? "Email *" : ""}
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
                            placeholder={!values.AddressLine1 ? "Address Line1 *" : ""}
                            label={values.AddressLine1 ? "Address Line1 *" : ""}
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
                            placeholder={!values.AddressLine2 ? "Address Line2" : ""}
                            label={values.AddressLine2 ? "Address Line2" : ""}
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
                                      setCountryName(value.countryName);
                                    }
                                    form.setFieldValue(
                                      "Country",
                                      value?.countryCode || "");
                                  }}
                                  onBlur={() => form.setFieldTouched("Country", true)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder={!values.Country ? "Country *" : ""}
                                      label={values.Country ? "Country *" : ""}
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
                                      placeholder={!values.State ? "State *" : ""}
                                      label={values.State ? "State *" : ""}
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
                            placeholder={!values.City ? "City" : ""}
                            label={values.City ? "City" : ""}
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
                            placeholder={!values.PostalCode ? "PostalCode *" : ""}
                            label={values.PostalCode ? "PostalCode *" : ""}
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
                            placeholder={!values.PhoneNumber ? "PhoneNumber *" : ""}
                            label={values.PhoneNumber ? "PhoneNumber *" : ""}
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
                            placeholder={!values.Amount ? "Amount *" : ""}
                            label={values.Amount ? "Amount *" : ""}
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
                                disabled
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
                                    placeholder={!values.Currency ? "Currency *" : ""}
                                    label={values.Currency ? "Currency *" : ""}
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
                          <div key={index} className='textFieldContainer fadeindown animation-duration-200'>
                            <TextField
                              style={{ marginBottom: '10px' }}
                              size="small"
                              value={value}
                              placeholder={!value ? "Invoice No *" : ""}
                              label={value ? "Invoice No *" : ""}
                              // placeholder={!value[index] ? "Invoice No *" : ""}
                              // label={value[index] ? "Invoice No *" : ""}
                              onChange={(e) => handleTextFieldChange(index, e.target.value)}
                              onBlur={() => handleTextFieldBlur(index)}
                              error={touchedFields[index] && value.trim() === ''}
                              helperText={touchedFields[index] && value.trim() === '' ? 'Field is required' : ''}
                            />

                            {textFields.length > 1 && (
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
