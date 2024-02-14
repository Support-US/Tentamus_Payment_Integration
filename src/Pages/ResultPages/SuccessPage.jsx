import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import AFLLogo from "../../images/AFL_Logo.png";
import ConfettiEffect from './ConfettiEffect';
import { showToast } from '../../Components/ToastUtils';
import CurrencyFormat from '../../Components/CurrencyFormat';
import { Button } from '@mui/material';
import { ArrowBackOutlined } from '@mui/icons-material';

const SuccessPage = () => {
  const [loading, setLoading] = useState(false);
  const Amount = localStorage.getItem("Amount");
  const Currency = localStorage.getItem("Currency");
  const TransactionId = localStorage.getItem("Tid");

  useEffect(() => {
    showToast(`Your last transaction was successful.`, "success");
  }, [])

  return (
    <>
      <ToastContainer />

      <ConfettiEffect />

      <span className='payment-text'>
        Your payment for {CurrencyFormat(Amount)} {Currency}
      </span>

      <span className='success-text'> Successful.</span >

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
        <div className="wrapper">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
      </div>

      <div className='flex justify-content-center align-items-center gap-2' style={{ color: "var(--primary-color)", marginTop: '-2.5rem', marginBottom: '2rem' }}>
        <span style={{ fontWeight: 450, fontSize: '1.2em' }} > Your Transaction ID {" "} : </span>
        <span style={{ fontWeight: 600, fontSize: '1.2em' }}>{TransactionId}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', marginBottom: '8rem' }}>
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

      <div className='mt-5 flex justify-content-center align-items-center gap-3 sm:gap-5' style={{ textAlign: 'center' }}>
        <img src={AFLLogo} alt="AFL Logo" style={{ width: '50px', height: 'auto' }} />
      </div>

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
          Analytical Food Laboratories
        </span>

      </div>

    </>
  )
}

export default SuccessPage;