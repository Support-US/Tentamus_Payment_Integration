// formSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    formData: {
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
        Address: ""
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
