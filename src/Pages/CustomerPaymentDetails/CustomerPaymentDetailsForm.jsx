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

const countries = cc.countries();
const newcountries = Country.getAllCountries();
const currency = cc.codes();

// const dropdowncountries = countries.map(country => {
//   return {
//     label: country,
//     value: country
//   };
// });

const dropdowncountries = newcountries.map(country => {
  return {
    countryName: country.name,
    countryCode: country.isoCode
  };
});

const dropdownCurrencies = currency.map(code => {
  return {
    label: code,
    value: code
  };
});

// console.log("currency", dropdownCurrencies);


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
  InvoiceNumbers: "",
}

const CustomerPaymentDetailsForm = () => {

  const [states, setStates] = useState([]);
  const [paygateURL, setPaygateURL] = useState("");

  const [clickCount, setClickCount] = useState(0);

  // console.log("c", clickCount);

  const [invoiceNumbers, setInvoiceNumbers] = useState([]);

  // console.log("invoice", invoiceNumbers);
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

  const handleFormSubmit = async (values, { resetForm }) => {

    const { AddressLine1, AddressLine2, City, State, Country, PostalCode, ...NewValues } = values;
    const AddressLine1confirm = values.AddressLine1 ? values.AddressLine1.trim() + "," : "";
    const AddressLine2confirm = values.AddressLine2 ? values.AddressLine2.trim() + "," : "";
    const Cityconfirm = values.City ? values.City.trim() + "," : "";
    const Stateconfirm = values.State ? values.State.trim() + "," : "";

    const confirmedValues = {
      ...NewValues,
      Address: AddressLine1confirm + AddressLine2confirm + Cityconfirm + Stateconfirm + values.Country + "-" + values.PostalCode,
      InvoiceNumbers: invoiceNumbers,
    }

    // Computop redirection
    handleComputopRedirection(confirmedValues.Currency, confirmedValues.Amount);

    try {
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
      setInvoiceNumbers([]);
      setClickCount(0)


      // return response.data.createPaymentDetails;



    } catch (error) {
      console.error("Create Payment Details error", error);
      throw error;
    }

  }

  const handleTotalResetForm = (handleReset) => {

    handleReset();

    setInvoiceNumbers([]);
    setClickCount(0)
  };

  const [textFields, setTextFields] = useState([]);

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

    <Card className='cardContainer'>
      <CardContent>
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
          {({ values, handleSubmit, handleReset, handleChange }) => (
            <form className='container'>
              <Grid container spacing={1}>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <Typography variant='h5'>
                    Payment Details
                  </Typography>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: "10px" }}>

                  {/* First Name */}
                  <Grid item xs={6}>
                    <FormControl fullWidth >
                      <Field
                        size="small"
                        name="FirstName"
                        type="text"
                        as={TextField}
                        label="First Name"
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
                        label="Last Name"
                      />
                    </FormControl>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Field
                        size="small"
                        name="Email"
                        type="text"
                        as={TextField}
                        label="Email ID"
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
                        label="Address Line 1"
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
                        <Field name="Country" onChange={handleChange}>
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
                                  label="Country"
                                  variant="outlined" />
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
                        {/* <Field
                    size="small"
                    name="State"
                    type="text"
                    as={TextField}
                    label="State"
                  /> */}
                        <Field name="state">
                          {({ field, form }) => (
                            <Autocomplete
                              size="small"
                              options={states}
                              getOptionLabel={(option) => option.name}
                              // value={dropdowncountries.find(
                              //   (option) => option.isoCode === field.isoCode
                              // ) || null
                              // }
                              // onChange={(event, value) => {

                              //   form.setFieldValue(
                              //     "Country",
                              //     value?.value || ""
                              //   );

                              // }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="State"
                                  variant="outlined" />
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
                        label="Postal Code"
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
                        label="Phone Number"
                      />
                    </FormControl>
                  </Grid>

                  {/* Amount */}
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Field
                        size="small"
                        name="Amount"
                        type="text"
                        as={TextField}
                        label="Amount"
                      />
                    </FormControl>
                  </Grid>

                  {/* Currency */}
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Field name="Currency" onChange={handleChange}>
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
                                label="Currency"
                                variant='outlined'
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
                        <IconButton onClick={handleAddTextField}>
                          <AddIcon />
                        </IconButton>
                      </div>
                    </div>
                    {textFields.map((value, index) => (
                      <div key={index} className='textFieldContainer'>
                        <TextField
                          size="small"
                          value={value}
                          onChange={(e) => handleTextFieldChange(index, e.target.value)}
                        />
                        <IconButton onClick={() => handleRemoveTextField(index)}>
                          <RemoveIcon />
                        </IconButton>
                      </div>
                    ))}
                  </Grid>

                  <Grid item xs={12} sm={12} container justifyContent="flex-end">
                    <div className='field-container' style={{ display: 'flex', gap: '10px' }}>
                      <FormControl>
                        <Button variant="outlined" color="error"
                          onClick={() => handleTotalResetForm(handleReset)}>
                          Cancel
                        </Button>
                      </FormControl>
                      <FormControl>
                        <Button variant="contained" color="success"
                          onClick={handleSubmit}
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
      </CardContent>
    </Card>
  );
};

export default CustomerPaymentDetailsForm;
