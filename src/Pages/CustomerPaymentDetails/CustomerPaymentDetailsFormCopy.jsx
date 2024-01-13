import React, { useState } from 'react';
import { Grid, TextField, FormControl, Typography, Button, Autocomplete} from '@mui/material';
import { Field, Formik } from 'formik';
import './CustomerPaymentDetailsForm.css';
import { API } from 'aws-amplify';
import { createPaymentDetails } from '../../graphql/mutations';
import { countries } from 'countries-list';
import {states} from 'us-states';


// import cc from 'currency-codes'

// const countries = cc.countries();
// const currency = cc.codes();


// const dropdowncountries = countries.map(country => {
//   return {
//     label: country,
//     value: country
//   };
// });

// const dropdownCurrencies = currency.map(code=>{
//   return{
//     label:code,
//     value:code
//   };
// });

// console.log("currency",dropdownCurrencies);






const initialValues = {
  TranscationId:"",
  MerchantId:"",
  ReferenceNumber:"",
  MAC:"",
  FirstName: "",
  LastName: "",
  Address: "",
  AddressLine1: "",
  AddressLine2: "",
  City: "",
  State: "",
  Country: "",
  PostalCode: "",
  Amount:"",
  Currency:"",
  InvoiceNumbers:"",
  Email: "",
  PhoneNumber: "",
}

console.log("initial",initialValues);



const CustomerPaymentDetailsForm = () => {
  
const[selectedCountry,setSelectedCountry]= useState(null);
const[selectedState, setSelectedState]= useState(null);

const handleCountryChange = (event,newValue)=>{
  setSelectedCountry(newValue)

  const countryInfo = countries[newValue];
  const countryCurrency = countryInfo ? countryInfo.currency : null;
}
const handleStateChange =(event,newValue)=>{
  setSelectedState(newValue)
}

console.log("countries", countries);
console.log("states", states);


  const [clickCount,setClickCount] = useState(0);

  console.log("c",clickCount);

  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  
  console.log("invoice",invoiceNumbers);


 const handlePlusButtonClick = () => {
  setClickCount(prevCount => prevCount + 1);
}

const handleInvoiceNumberChange = (index, value) => {
  const updatedInvoiceNumbers = [...invoiceNumbers];
  updatedInvoiceNumbers[index] = value;
  setInvoiceNumbers(updatedInvoiceNumbers);
};



const handleFormSubmit = async (values,{resetForm,...formikProps}) => {
    console.log("Formik State:", { values, ...formikProps });
    
    console.log("values", values);
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
    
    console.log("NewValues", NewValues)
    console.log("confimed", confirmedValues)



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
      console.log("reset",resetForm)

      // return response.data.createPaymentDetails;



    } catch (error) {
      console.error("Create Payment Details error", error);
      throw error;
    }

  }

  const handleTotalResetForm = (handleReset) => {
    // Reset the form using Formik
    handleReset();
    // Reset the invoiceNumbers state
    setInvoiceNumbers([]);
    setClickCount(0)
  };
  

  return (


    <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
      {({ handleSubmit, handleReset, handleChange }) => (
        <form className='container'>
          <Grid container spacing={1}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Typography variant='h5'>
                Customer Payment Details
              </Typography>
            </Grid>


            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth>
                  <Field
                    size="small"
                    name="FirstName"
                    type="text"
                    as={TextField}
                    label="First Name"
                  />
                </FormControl>
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth>
                  <Field
                    size="small"
                    name="LastName"
                    type="text"
                    as={TextField}
                    label="Last Name"
                  />
                </FormControl>
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth>
                  <Field
                    size="small"
                    name="Email"
                    type="text"
                    as={TextField}
                    label="Email ID"
                  />
                </FormControl>
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth>
                  <Field
                    size="small"
                    name="AddressLine1"
                    type="text"
                    as={TextField}
                    label="Address Line 1"
                  />
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth>
                  <Field
                    size="small"
                    name="AddressLine2"
                    type="text"
                    as={TextField}
                    label="Address Line 2"
                  />
                </FormControl>
              </div>
            </Grid>
           

            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth  >
                  <Field name="Country" onChange={handleChange}>
                    {({ field, form }) => (
                      <Autocomplete
                        size="small" 
                        options={Object.values(countries)}
                        getOptionLabel={(option) => option.name}
                        value={selectedCountry}
                        onChange={handleCountryChange}
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

            <Field name="state" onChange={handleChange}>
  {({ field, form }) => (
    <Autocomplete
      size="small"
      options={Object.values(states)}  // Assuming states is an object with values as options
      getOptionLabel={(option) => option.name}
      value={selectedState}
      onChange={handleStateChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="State/Region"
          variant="outlined"
        />
      )}
    />
  )}
</Field>



            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth>
                  <Field
                    size="small"
                    name="City"
                    type="text"
                    as={TextField}
                    label="City"
                  />
                </FormControl>
              </div>
            </Grid>



            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth>
                  <Field
                    size="small"
                    name="PostalCode"
                    type="text"
                    as={TextField}
                    label="Postal Code"
                  />
                </FormControl>
              </div>
            </Grid>


            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth>
                  <Field
                    size="small"
                    name="PhoneNumber"
                    type="number"
                    as={TextField}
                    label="Phone Number"
                  />
                </FormControl>
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className='field-container'>
                <FormControl fullWidth>
                  <Field
                    size="small"
                    name="Amount"
                    type="number"
                    as={TextField}
                    label="Amount"
                  />
                </FormControl>
              </div>
            </Grid>


            {/* <Grid item xs={12} sm={6}>
              <div className='field-container'>
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
              </div>
            </Grid> */}


            <Grid item xs={12} sm={12}>
              <div className='field-container'>
                <FormControl style={{ width:"50%"}} >
                  <div style={{ display: 'flex', alignItems: 'Center' }}>
                    <span>Invoice Details</span>
                    <Button onClick={handlePlusButtonClick}>+</Button>
                  </div>

                  {Array.from({ length: clickCount }).map((_, index) => (
                    <TextField
                      key={index}
                      size="small"
                      label={`Invoice Number ${index + 1}`}
                      fullWidth
                      margin="normal"
                      onChange={(e) => handleInvoiceNumberChange(index, e.target.value)}
                    />
                  ))}
                </FormControl>
              </div>
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

        </form>


      )}
    </Formik>

  )

 
}

export default CustomerPaymentDetailsForm;