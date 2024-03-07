import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AFLLogo from "../../images/AFL_Logo.png";
import CFLLogo from "../../images/CFL_Logo.png"
import { showToast } from '../../Components/ToastUtils';
import CurrencyFormat from '../../Components/CurrencyFormat';
import { Button } from '@mui/material';
import { ArrowBackOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const FailurePage = () => {
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    merchantID: "",
    payID: "",
    amount: "",
    currency: "",
    description: "",
    clientname: ""
  });
  const [srcLogo, setSrcLogo] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [logoStyle, setLogoStyle] = useState({ width: '50px', height: 'auto' });


  const navigate = useNavigate();

  const navigateToCustomerPaymentDetailsForm = () => {
    if (paymentDetails.clientname === 'Analytical Food Laboratories') {
      navigate('/AnalyticalFoodLaboratories');
    } else if (paymentDetails.clientname === 'Columbia Food Laboratories') {
      navigate('/ColumbiaLaboratories');
    }
  };


  const location = useLocation();

  useEffect(() => {
    console.log("location.search",location.search);
    // Parse URL to get parameters
    const searchParams = new URLSearchParams(location.search);
    console.log("searchparams", searchParams);
    const transId = searchParams.get('TransID');
    console.log("transid", transId);

    if (transId) {
      // Set the TransID as id
      const id = transId;

      // Make a GET request using Axios
      try {
        axios.get(`https://8gc7cikm63.execute-api.us-east-2.amazonaws.com/dev/items?id=${id}`)
          .then(response => {
            const responseData = response.data;
            console.log("responseData", responseData);

            setPaymentDetails({
              merchantID: searchParams.get('mid'),
              payID: searchParams.get('PayID'),
              description: searchParams.get('Description'),
              amount: responseData.Amount,
              currency: responseData.Currency,
              clientname: responseData.ClientName
            });

            if (responseData.ClientName === 'Analytical Food Laboratories') {
              setSrcLogo(AFLLogo);
              setCompanyName('Analytical Food Laboratories');
            } else if (responseData.ClientName === 'Columbia Food Laboratories') {
              setSrcLogo(CFLLogo);
              setCompanyName('Columbia Food Laboratories');
              setLogoStyle({ width: '100px', height: 'auto' });
            }

          });
      }
      catch (error) {
        console.log("fetchPaymentDetails error", error);
        showToast("Data fetch error", "error");

      }
      console.log("pay", paymentDetails);
    }
  }, [location.search]);

  return (
    <>
      {
        paymentDetails.amount !== '' ?
          <>
            <ToastContainer />

            <span className='payment-failure-text'>
              Your payment for {CurrencyFormat(paymentDetails.amount)} {paymentDetails.currency}
            </span>
            <span className='failure-text'> Failed!</span >

            <div className="wrapper">
              <svg className="crossmark addClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="100" height="100">
                <circle className="crossmark__circle animateElement" cx="26" cy="26" r="25" fill="none" />
                <path className="cross__path cross__path--right animateElement" fill="none" d="M16,16 l20,20" />
                <path className="cross__path cross__path--left animateElement" fill="none" d="M16,36 l20,-20" />
              </svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-13rem', marginBottom: '3rem' }}>
              <Button
                variant='outlined'
                color='error'
                size='small'
                style={{ textTransform: "capitalize", fontWeight: 600 }}
                onClick={navigateToCustomerPaymentDetailsForm}
              >
                Try Again
              </Button>
            </div>

            <div className='flex justify-content-center gap-2'
              style={{ color: "var(--primary-color)", marginTop: '-2.5rem', marginBottom: '3rem', marginLeft: "10rem" }}
            >

              <table>
                <tbody>
                  <tr>
                    <th className="text-left" style={{ fontWeight: 450, fontSize: '1.2em' }}>Description</th>
                    <td style={{ padding: '0 10px' }}>:</td>
                    <td style={{ fontWeight: 600, fontSize: '1.2em', padding: '0 10px' }}>{paymentDetails.description}</td>
                  </tr>
                  <tr>
                    <th className="text-left" style={{ fontWeight: 450, fontSize: '1.2em' }}>Merchant ID</th>
                    <td style={{ padding: '0 10px' }}>:</td>
                    <td style={{ fontWeight: 600, fontSize: '1.2em', padding: '0 10px' }}>{paymentDetails.merchantID}</td>
                  </tr>
                  <tr>
                    <th className="text-left" style={{ fontWeight: 450, fontSize: '1.2em' }}>Pay ID</th>
                    <td style={{ padding: '0 10px' }}>:</td>
                    <td style={{ fontWeight: 600, fontSize: '1.2em', padding: '0 10px' }}>{paymentDetails.payID}</td>
                  </tr>

                </tbody>
              </table>

            </div>


            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', marginBottom: '4rem' }}>
              {
                loading === true ?
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      size='small'
                      disabled
                      style={{ textTransform: "capitalize", fontWeight: 600 }}
                    >
                      Forwarding to {paymentDetails.clientname === 'Analytical Food Laboratories' ? 'AFL' : paymentDetails.clientname === 'Columbia Food Laboratories' ? 'CFL' : undefined} ...
                    </Button>
                  </>
                  :
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      size='small'
                      startIcon={<ArrowBackOutlined />}
                      style={{ textTransform: "capitalize", fontWeight: 600 }}
                      onClick={() => {
                        (window.location.href = paymentDetails.clientname === 'Analytical Food Laboratories' ? 'https://www.afltexas.com': paymentDetails.clientname === 'Columbia Food Laboratories' ?'https://www.columbialaboratories.com':undefined);
                        setLoading(true);
                      }
                      }
                    >
                     Back to {paymentDetails.clientname === 'Analytical Food Laboratories' ? 'AFL' : paymentDetails.clientname === 'Columbia Food Laboratories' ? 'CFL' : undefined}
                    </Button>
                  </>
              }
            </div>

            <div className='mt-5 flex justify-content-center align-items-center gap-3 sm:gap-5' style={{ textAlign: 'center' }}>
              {srcLogo && <img src={srcLogo} style={logoStyle} alt={companyName} />}
            </div>


            {/* <div className='mt-5 flex justify-content-center align-items-center gap-3 sm:gap-5' style={{ textAlign: 'center' }}>
              <img src={AFLLogo} alt="AFL Logo" style={{ width: '50px', height: 'auto' }} />
            </div> */}

            <div>
              <span style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'baseline',
                marginTop: '0.5rem',
                fontWeight: 600,
                color: '#007640',
                fontSize: '15px',
              }}>
              {companyName} 
              </span>

            </div>

          </>
          :
          <>
            <div className="overlays mb-3">
              <div className="overlay__inner">
                {/* <span class="processing-text">Payment Processing...</span> */}
                <div className="overlay__content">
                  <span className="spinner"></span>
                </div>
                {/* <span className='flex justify-content-center align-items-center h-screen mt-5'>Please don't refresh the page</span> */}
                <span className='flex justify-content-center align-items-center h-screen mt-5'>Payment Processing...</span>
              </div>
            </div>
          </>
      }

    </>
  )
}

export default FailurePage;




