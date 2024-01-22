import React, { useState } from 'react';
import { Card, Grid, TextField, FormControl, Typography, Autocomplete, CardContent, Divider, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Field, Formik } from 'formik';
import './CustomerPaymentDetailsForm.css';
import { API } from 'aws-amplify';
import cc from 'currency-codes'
import { createPaymentDetails } from '../../graphql/mutations';
import { BlowfishEncryption } from '../../Components/BlowfishEncryption';
import { Country, State, City } from 'country-state-city';
import { useDispatch, useSelector } from 'react-redux';
import { selectFormData, updateFormData } from '../../Store/Slice/formSlice';

const newcountries = Country.getAllCountries();
const currency = cc.codes();

const dropdowncountries = newcountries.map(country => {
  // console.log("country",country);
  return {
    countryName: country.name,
    countryCode: country.isoCode
  };
});

const dropdownCurrencies = currency.map(code => {
  // console.log("Currency",currency);
  return {
    label: code,
    value: code
  };
});

const CustomerPaymentDetailsForm = () => {

  const [states, setStates] = useState([]);
  const [paygateURL, setPaygateURL] = useState("");
  const dispatch = useDispatch();
  const initialValues = useSelector(selectFormData);

  const handleComputopRedirection = (Currency, Amount) => {

    let data = `Currency=${Currency}&Amount=${Amount}&MAC=e55761ccb8be287c7c3ed14dbea1060fb4d1fc47f9c73c3b63d0c6215102f2ac`;
    const computopDataParameter = BlowfishEncryption(data);

    const merchantID = 'Generic3DSTest';
    const backgroundURL = 'https://www.tentamus.com/wp-content/uploads/2021/03/about_us_tentamus_fahnen_IMG_0722-2799x1679.jpg';

    console.log(`Currency=${Currency}&Amount=${Amount}`, "merchantID", merchantID, "len", data.length, "data", computopDataParameter);

    // setPaygateURL(`https://www.computop-paygate.com/payssl.aspx?MerchantID=Generic3DSTest&Len=${(`Currency=${Currency}&Amount=${Amount}`).length}&Data=${computopDataParameter}`);
    // window.open(paygateURL, '_blank', 'noopener,noreferrer');

    window.open(`https://www.computop-paygate.com/payssl.aspx?MerchantID=${merchantID}&Len=${data.length}&Data=${computopDataParameter}`, '_blank', 'noopener,noreferrer');
  }

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
    const lettersOnlyRegex = /^[a-zA-Z]+$/;

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
    if (!value) {
      error = "Field is required";
    }
    return error
  }

  const validatePostalCode = (value) => {
    let error;
    if (!value) {
      error = "Field is required. For example:542105";
    } else if (!/^\d+$/.test(value)) {
      error = "Please enter a valid postal code.For example:542105";
    }
    return error;
  };

  const validatePhoneNumber = (value) => {

    let error;
    if (!value) {
      error = "Field is required";
    } else if (!/^\+\d+$/.test(value)) {
      error = "Please enter a valid phone number with your country code";
    }
    return error
  }

  const validateAmount = (value) => {

    let error;
    if (!value) {
      error = "Field is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      error = "Please enter a valid amount. For example:1456.23";
    }
    else if (/\D/.test(value)) {
      error = "Please enter only digits";
    }
    return error
  }

  const validateCurrency = (value) => {

    let error;
    if (!value) {
      error = "Field is required.For example USD ";
    }
    return error
  }

  const validateInvoiceNo = (value) => {

    let error;
    if (!value) {
      error = "Field is required";
    }
    return error
  }



  const handleFormSubmit = async (values, { resetForm }) => {

    const { AddressLine1, AddressLine2, City, State, Country, PostalCode, ...NewValues } = values;
    const AddressLine1confirm = values.AddressLine1 ? values.AddressLine1.trim() + "," : "";
    const AddressLine2confirm = values.AddressLine2 ? values.AddressLine2.trim() + "," : "";
    const Cityconfirm = values.City ? values.City.trim() + "," : "";
    const Stateconfirm = values.State ? values.State.trim() + "," : "";

    const formData = {
      ...NewValues,
      Address: AddressLine1confirm + AddressLine2confirm + Cityconfirm + Stateconfirm + values.Country + "-" + values.PostalCode,
    }

    // Computop redirection
    handleComputopRedirection(formData.Currency, formData.Amount);

    try {
      dispatch(updateFormData(formData));
      console.log("formDataaa", formData);
      // const response = await API.graphql(
      //   {
      //     query: createPaymentDetails,
      //     variables: {
      //       input: confirmedValues
      //     }
      //   }
      // )
      // console.log("GraphQL Response:", response);

      resetForm();




      // return response.data.createPaymentDetails;



    } catch (error) {
      console.error("Create Payment Details error", error);
      throw error;
    }

  }

  const handleTotalResetForm = (handleReset) => {

    handleReset();



  };

  const [textFields, setTextFields] = useState(['']); // Initialize with one empty string

  const handleAddTextField = () => {
    setTextFields([...textFields, '']);
  };

  const handleRemoveTextField = (index) => {
    const updatedTextFields = [...textFields];
    updatedTextFields.splice(index, 1);
    setTextFields(updatedTextFields);
  };

  const handleTextFieldChange = (index, value) => {
    const updatedTextFields = [...textFields];
    updatedTextFields[index] = value;
    setTextFields(updatedTextFields);
  };


  return (
    <div>
      <div className='card-container'>
        <div>
          <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
            {({ values, handleSubmit, handleReset, handleChange, errors, touched }) => (

              <form className='form-container'>
                <Grid>
                  {/* Heading */}
                  <div style={{ textAlign: 'center' }}>
                    <span className='header'>
                      Payment Details
                    </span>
                  </div>

                  <Grid container spacing={2} style={{ marginTop: "10px" }}>
                    {/* First Name */}
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <Field
                          size="small"
                          name="FirstName"
                          type="text"
                          as={TextField}
                          label="First Name*"
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
                          label="Last Name*"
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
                          label="Company Name*"
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
                          label="Email ID*"
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
                          label="Address Line 1*"
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
                          <Field name="Country" validate={validateCountry} onChange={handleChange}>
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
                                    value?.countryCode || ""
                                  );

                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Country*"
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
                          <Field name="state" validate={validateState}>
                            {({ field, form }) => (
                              <Autocomplete
                                size="small"
                                options={states}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="State*"
                                    variant="outlined"
                                    helperText={(touched.state && errors.state)}
                                    error={touched.state && Boolean(errors.state)} />
                                )}
                              >
                              </Autocomplete>
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
                          label="Postal Code*"
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
                          as={TextField}
                          label="Phone Number*"
                          helperText={(touched.PhoneNumber && errors.PhoneNumber)}
                          error={touched.PhoneNumber && Boolean(errors.PhoneNumber)}
                          value={values.PhoneNumber}
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
                          label="Amount*"
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
                        <Field name="Currency" validate={validateCurrency} onChange={handleChange}>
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
                                  label="Currency*"
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
                    <Grid item xs={6}>
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
                        <div key={index} className='textFieldContainer'>
                          <TextField
                            style={{ marginBottom: '10px' }}
                            size="small"
                            value={value}
                            label="Invoice No*"
                            onChange={(e) => handleTextFieldChange(index, e.target.value)}

                          />
                          {textFields.length > 1 && ( // Check if there is more than one text field
                            <IconButton size='small' onClick={() => handleRemoveTextField(index)}>
                              <RemoveIcon />
                            </IconButton>
                          )}
                        </div>
                      ))}
                    </Grid>

                    {/* Button */}
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
  );
};

export default CustomerPaymentDetailsForm;
