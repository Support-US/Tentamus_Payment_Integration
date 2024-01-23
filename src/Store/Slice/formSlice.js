// formSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    formData: {
        FirstName: "",
        LastName: "",
        CompanyName: "",
        Email: "",
        AddressLine1: "",
        AddressLine2: "",
        Country: "US",
        State: "",
        City: "",
        PostalCode: "",
        PhoneNumber: "+1",
        Amount: "", 
        Currency: "USD",
        EncryptionPassword: "", 
        HMacPassword: "",
        MerchantID: "",
        PaymentId: "",
        Status: "inprogress", 
        TransactionID: "",
    },
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        updateFormData: (state, action) => {
            return {
                ...state,
                formData: { ...state.formData, ...action.payload },
            };
        },
    },
});

export const { updateFormData } = formSlice.actions;
export const selectFormData = (state) => state.form.formData;
export default formSlice.reducer;
