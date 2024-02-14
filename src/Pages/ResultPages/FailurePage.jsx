import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AFLLogo from "../../images/AFL_Logo.png";
import { showToast } from '../../Components/ToastUtils';
import CurrencyFormat from '../../Components/CurrencyFormat';
import { Button } from '@mui/material';
import { ArrowBackOutlined } from '@mui/icons-material';

const FailurePage = () => {
  const [loading, setLoading] = useState(false);
  const Amount = localStorage.getItem("Amount")
  const Currency = localStorage.getItem("Currency")
  const TransactionId = localStorage.getItem("Tid");

  const navigate = useNavigate();

  const navigateToCustomerPaymentDetailsForm = () => {
    navigate('/');
  };

  useEffect(() => {
    showToast(`Your last transaction was Failed!`, "error");
  }, [])

  return (
    <>
      <ToastContainer />

      <div className="card-container-receipt">
        <div className="card-recipt">

          <span className='payment-failure-text'>
            Your payment for {CurrencyFormat(Amount)} {Currency}
          </span>
          <span className='failure-text'> Failed!</span >

          <div className="wrapper">
            <svg className="crossmark addClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="100" height="100">
              <circle className="crossmark__circle animateElement" cx="26" cy="26" r="25" fill="none" />
              <path className="cross__path cross__path--right animateElement" fill="none" d="M16,16 l20,20" />
              <path className="cross__path cross__path--left animateElement" fill="none" d="M16,36 l20,-20" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-15rem' }}>
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

          <div className='flex justify-content-center align-items-center' style={{ color: "var(--primary-color)", marginTop: '1rem', marginBottom: '2rem' }}>
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

        </div>
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

export default FailurePage;




