import React from 'react';
import { Grid, TextField, FormControl, Typography,Button,Autocomplete } from '@mui/material';
import { Field, Formik } from 'formik';
import './CustomerPaymentDetailsForm.css';
import { createPaymentDetails } from '../../graphql/mutations';
import { API } from 'aws-amplify';
import cc from 'currency-codes';

const countries = cc.countries();
const currency = cc.codes();

const initialValues ={
  FirstName:"",
  LastName:"",
  Address:"",
  Amount:"",
  Currency:"",
  Email:"",
  PhoneNumber:"",
}



const CustomerPaymentDetailsForm = () => {

  const handleFormSubmit = async(paymentDetails)=>{
   const confirmedData = {Address: paymentDetails.Address,
    Amount:paymentDetails.Amount, BankPaymentAdviceId: "025841541", Currency: paymentDetails.Currency, 
    Email:paymentDetails.Email , FirstName:paymentDetails.FirstName , InvoiceNumbers: "ngkjergbi", 
    LastName:paymentDetails.LastName , MerchantID: "258258", PhoneNumber:paymentDetails.PhoneNumber , ReferenceNo: "5486", 
    Status: "inprogress", TransactionID: "123654"}
  
    try{
      const response = await API.graphql(
        {
          query:createPaymentDetails,
          variables:{
            input: confirmedData
          }
        }
      )
      console.log("GraphQL Response:", response);
      
      
        return response.data.createPaymentDetails;

   
  
    }catch(error){
      console.error("Create Payment Details error", error);
      throw error;
    }
    


  }


  return (
    <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
        {({ handleSubmit, handleReset }) => (
      <form  className='container'>
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
                  name="State"
                  type="text"
                  as={TextField}
                  label="State"
                />
              </FormControl>
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <div className='field-container'>
        <FormControl fullWidth>
          <Field name="Country" >
            {({ field, form }) => (
              <Autocomplete
                size="small"
                disableClearable
                
                fullWidth
            
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country*"
                    variant="outlined"
                    error={form.touched.Country && Boolean(form.errors.Country)}
                    helperText={form.touched.Country && form.errors.Country}
                  />
                )}
              />
            )}
          </Field>
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
                  name="Currency"
                  type="text"
                  as={TextField}
                  label=" Currency"
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
                  label="Email_Id"
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
                  type="text"
                  as={TextField}
                  label="Phone Number"
                />
              </FormControl>
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
          <div className='field-container' style={{ display: 'flex', gap: '10px' }}>
              <FormControl>
              <Button variant="outlined" color="error"
              onClick={handleReset}
           
              >
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