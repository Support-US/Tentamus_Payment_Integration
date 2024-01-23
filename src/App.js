import awsExports from './aws-exports'
import CustomerPaymentDetailsForm from './Pages/CustomerPaymentDetails/CustomerPaymentDetailsForm';
import { Amplify } from 'aws-amplify';
import FailurePage from './Pages/ResultPages/FailurePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout/Layout';
import SuccessPage from './Pages/ResultPages/SuccessPage';

Amplify.configure(awsExports)

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <CustomerPaymentDetailsForm />,
        },
        {
          path: "success",
          element: <SuccessPage />,
        },
        {
          path: "error",
          element: <FailurePage />
        }
      ]
    }
  ])

  return (
    <>
      <div className='App'>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
