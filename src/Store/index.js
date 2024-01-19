// index.js
import { configureStore } from '@reduxjs/toolkit';
import formSlice from './Slice/formSlice';

const store = configureStore({
  reducer: {
    form: formSlice,
  },
});

export default store;
