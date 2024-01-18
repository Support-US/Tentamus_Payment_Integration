import React ,{useState} from 'react';
import {Card, Grid, TextField, FormControl, Typography, Autocomplete, CardContent,Divider,IconButton,Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Field, Formik } from 'formik';
import './CustomerPaymentDetailsForm.css';
import { API } from 'aws-amplify';
import { createPaymentDetails } from '../../graphql/mutations';
import cc from 'currency-codes'


const currency = cc.codes();
const dropdownCurrencies = currency.map(code=>{
  return{
    label:code,
    value:code
  };
});


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
  Amount:"",
  Currency:"",
  InvoiceNumber:"",
}

console.log("initial",initialValues);



const CustomerPaymentDetailsFormCopy = () => {

  const [showInvoiceField, setShowInvoiceField] = useState(false);

  const handlePlusButtonClick = () => {
    setShowInvoiceField(true);
  };

  const handleMinusButtonClick = () => {
    setShowInvoiceField(false);
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
     
      // return response.data.createPaymentDetails;



    } catch (error) {
      console.error("Create Payment Details error", error);
      throw error;
    }

  }

  const handleTotalResetForm = (handleReset) => {
     handleReset();
 };

 
  

  return (
    <Card className="cardContainer">
      <CardContent>
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
          {({ handleSubmit, handleReset, handleChange }) => (
            <form>
              <Typography variant='h5' className="heading">
                Customer Payment Details
              </Typography>

          <Grid container spacing={2} style={{marginTop:"10px"}}>
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

            <Grid item xs={4}>
              <FormControl fullWidth>
                <Field
                  size="small"
                  name="Country"
                  type="text"
                  as={TextField}
                  label="Country"
                />
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <Field
                  size="small"
                  name="State"
                  type="text"
                  as={TextField}
                  label="state"
                />
              </FormControl>
            </Grid>

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

            <Grid item xs={6}>
             <div className='invoiceDetails'>
              Invoice Details
             </div>
            </Grid>

            <Grid item xs={6}>
            <Typography variant='caption' style={{ textAlign: 'center', fontSize: '16px', color: 'blue' }}>
                    ADD INVOICE
              </Typography>
             <IconButton onClick={handlePlusButtonClick}>
                <AddIcon/>
             </IconButton>
            </Grid>

            {showInvoiceField && (
                  <>      
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Field
                  size="small"
                  name="InvoiceNumber"
                  type="text"
                  as={TextField}
                  label="Invoice Number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
            <IconButton onClick={handleMinusButtonClick}>
                <RemoveIcon />
              </IconButton>
            </Grid>
          </>
            )}

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
      </CardContent>
    </Card>
  );
};

export default CustomerPaymentDetailsFormCopy;
