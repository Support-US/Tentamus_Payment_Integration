import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import { Button } from '@mui/material';

// import AFLLogo from "../../images/AFL_Logo.png";
import CFLLogo from "../../images/CFL_Logo.png";
import AdamsonLogo from "../../images/AdamsonLogo.png";
import TentamusLogo from "../../images/tentamus.png";

import ConfettiEffect from './ConfettiEffect';
import { showToast } from '../../Components/ToastUtils';
import CurrencyFormat from '../../Components/CurrencyFormat';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
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
  const [logoStyle, setLogoStyle] = useState({ width: '80px', height: 'auto' });
  const [websiteURL, setWebsiteURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const apiUrl = process.env.REACT_APP_GET_PAYMENT_DETAILS_API;

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const transId = searchParams.get('TransID');
      const payId = searchParams.get('PayID');
      const mac = searchParams.get('MAC');
      const code = searchParams.get('Code');
      const status = searchParams.get('Status');
      const mid = searchParams.get('mid');

      if (transId && payId && mac && code && status && mid) {

        const data = { id: transId, payId: payId, mac: mac, code: code, status: status, mid: mid };

        try {
          await axios.post(apiUrl,
            JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json'
            },
          })

            .then(response => {
              const responseData = response.data;
              // console.log("responseData", responseData);

              setPaymentDetails({
                merchantID: searchParams.get('mid'),
                payID: searchParams.get('PayID'),
                description: searchParams.get('Description'),
                amount: responseData.Amount,
                currency: responseData.Currency,
                clientname: responseData.ClientName
              });


              switch (responseData.ClientName) {
                // case 'Analytical Food Laboratories':
                //   setSrcLogo(AFLLogo);
                //   setCompanyName('Analytical Food Laboratories');
                //   setWebsiteURL("https://www.afltexas.com");
                //   break;

                case 'Columbia Laboratories':
                  setSrcLogo(CFLLogo);
                  setCompanyName('Columbia Laboratories');
                  setLogoStyle({ width: '170px', height: 'auto' });
                  setWebsiteURL("https://www.columbialaboratories.com");
                  break;

                case 'Tentamus North America Virginia':
                  setSrcLogo(TentamusLogo);
                  setCompanyName('Tentamus North America Virginia');
                  setLogoStyle({ width: '170px', height: 'auto' });
                  setWebsiteURL("https://www.tentamus-va.com/");
                  break;

                case 'Adamson Analytical Labs':
                  setSrcLogo(AdamsonLogo);
                  setCompanyName('Adamson Analytical Labs');
                  setLogoStyle({ width: '170px', height: 'auto' });
                  setWebsiteURL("https://www.adamsonlab.com/");
                  break;
              }


              // if (responseData.ClientName === 'Analytical Food Laboratories') {
              //   setSrcLogo(AFLLogo);
              //   setCompanyName('Analytical Food Laboratories');
              //   setWebsiteURL("https://www.afltexas.com");
              // } 
              // else if (responseData.ClientName === 'Columbia Food Laboratories') {
              //   setSrcLogo(CFLLogo);
              //   setCompanyName('Columbia Food Laboratories');
              //   setLogoStyle({ width: '170px', height: 'auto' });
              //   setWebsiteURL("https://www.columbialaboratories.com");
              // }
              setLoading(false);
            })
            .catch(error => {
              setLoading(false);
              setShowError(true);
            })
        }
        catch (error) {
          setLoading(false);
          setShowError(true);
          console.log("fetchPaymentDetails error", error);
          showToast("Data fetch error, but your transaction was successful.", "error");
        }
      }
      else {
        showToast('Something went wrong. Please contact the admin.', 'error',5000);
        setLoading(false);
        setShowError(true);
      }
    }

    fetchData();

  }, []);



  return (
    <>
      <ToastContainer />

      {
        (!loading && paymentDetails.amount !== '') &&
        <>

          <ConfettiEffect />

          <span className='payment-text'>
            Your payment for {CurrencyFormat(paymentDetails.amount)} {paymentDetails.currency}
          </span>

          <span className='success-text'> Successful.</span>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
            <div className="wrapper">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </div>

          <div className='flex justify-content-center gap-2'
            style={{ color: "var(--primary-color)", marginTop: '-2.5rem', marginBottom: '3rem', marginLeft: "10rem" }}
          >
            <>
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
            </>
          </div>

          {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', marginBottom: '4rem' }}>
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
            </div> */}

          <div className='flex justify-content-center align-items-center gap-3 sm:gap-5' style={{ textAlign: 'center', marginTop: '5rem' }}>
            {srcLogo && (
              <a href={websiteURL} target="_blank" rel="noopener noreferrer">
                <img src={srcLogo} style={logoStyle} alt={`${companyName} Logo`} />
              </a>
            )}
          </div>


          <div>
            <span style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              marginTop: '0.5rem',
              fontWeight: 600,
              color: 'var(--primary-color)',
              fontSize: '15px',
            }}>
              {companyName}
            </span>
          </div>
        </>
      }
      {
        loading &&
        <>
          <div className="overlays mb-3">
            <div className="overlay__inner">
              <div className="overlay__content">
                <span className="spinner"></span>
              </div>
              <span className='flex justify-content-center align-items-center h-screen mt-5'>
                Payment Processing ...
              </span>
            </div>
          </div>
        </>
      }
      {
        (!loading && showError) &&
        <>
          <span className='flex flex-column justify-content-center align-items-center h-screen'>

            <h1 className='text-2xl font-bold text-center' style={{ color: "#4CAF50" }}>
              Something went wrong. <br /> Please try again
            </h1>

            <Button
              variant='outlined'
              color="success"
              className='mt-3'
              // size='small'
              style={{ textTransform: 'none', fontWeight: 600 }}
              onClick={() => window.location.href = "/"}>
              Go to Home
            </Button>
          </span>
        </>
      }
    </>

  )
}

export default SuccessPage;



