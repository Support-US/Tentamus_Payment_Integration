import awsExports from './aws-exports'
import CustomerPaymentDetailsForm from './Pages/CustomerPaymentDetails/CustomerPaymentDetailsForm';
import Landingpage from './Pages/Landingpage/Landingpage';
import { Amplify } from 'aws-amplify';
import FailurePage from './Pages/ResultPages/FailurePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout/Layout';
import SuccessPage from './Pages/ResultPages/SuccessPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ErrorPage from './Pages/ErrorPage/ErrorPage';

Amplify.configure(awsExports)


const theme = createTheme({
  typography: {
    fontFamily: 'Barlow, sans-serif',
  },
});


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Landingpage />,
        },
        // {
        //   path: "/AnalyticalFoodLaboratories",
        //   element: <CustomerPaymentDetailsForm />,
        // },
        {
          path: "/ColumbiaLaboratories",
          element: <CustomerPaymentDetailsForm />,
        },
        {
          path: "/AdamsonAnalyticalLabs",
          element: <CustomerPaymentDetailsForm />,
        },
        {
          path: "/TentamusNorthAmericaVirginia",
          element: <CustomerPaymentDetailsForm />,
        },
        {
          path: "/success",
          element: <SuccessPage />,
        },
        {
          path: "/error",
          element: <FailurePage />,
        },
        {
          path: "*",
          element: <ErrorPage />,
        }
      ]
    }
  ])

  return (
    <ThemeProvider theme={theme}>
      <>
        <div className='App'>
          <RouterProvider router={router} />
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;
