import React, { useEffect, useState } from 'react'
import SucessImage from "./SuccessImage.jpg"
// import image from "./image.png"
import { ToastContainer } from 'react-toastify';
import AFLLogo from "../../images/AFL_Logo.png";
import ConfettiEffect from './ConfettiEffect';
import { showToast } from '../../Components/ToastUtils';
import CurrencyFormat from '../../Components/CurrencyFormat';
import { Button } from '@mui/material';
import { ArrowBackOutlined, ArrowLeftOutlined } from '@mui/icons-material';

const SuccessPage = () => {
  const [loading, setLoading] = useState(false);
  const Amount = localStorage.getItem("Amount");
  const Currency = localStorage.getItem("Currency");

  useEffect(() => {
    // showToast(`Your last transaction for an amount of ${Amount} ${Currency} was successful.`, "success");
    showToast(`Your last transaction was successful.`, "success");
  }, [])

  return (
    <>
      <div className='mt-5 flex justify-content-center align-items-center gap-3 sm:gap-5' style={{ textAlign: 'center' }}>
        <img src={AFLLogo} alt="AFL Logo" style={{ width: '50px', height: 'auto' }} />
        <span className='text-center'>
          Analytical Food Laboratories
        </span>
      </div>
      <ToastContainer />

      <ConfettiEffect />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        {/* <img
          src={SucessImage}
          // src={image}
          alt="Success Illustration"
          style={{ width: '550px', height: "400px" }}
        /> */}
        <div class="wrapper"> <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        </div>
      </div>

      <span className='payment-success-text' style={{ fontWeight: 450, fontSize: '1.4em', textAlign: 'center' }}>
        Your last transaction for an amount of&nbsp;
        <span style={{ fontWeight: 800, fontSize: '1.2em' }}>{CurrencyFormat(Amount)}</span>&nbsp;
        <span style={{ fontWeight: 800, fontSize: '1.2em' }}>{Currency}</span>&nbsp;
        was
        <span style={{ fontWeight: 800, fontSize: '1.2em' }}>&nbsp;successful.</span>
      </span>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "2rem" }}>
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
                Forwarding to AFL ...
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
                  (window.location.href = 'https://www.afltexas.com');
                  setLoading(true);
                }
                }
              >
                Back to AFL
              </Button>
            </>
        }
      </div>

    </>
  )
}

export default SuccessPage;