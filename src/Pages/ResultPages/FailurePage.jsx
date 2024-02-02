import React, { useEffect } from 'react'
import FailureImage from './FailureImage.png'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AFLLogo from "../../images/AFL_Logo.png";
import { showToast } from '../../Components/ToastUtils';

const FailurePage = () => {

  const Amount = localStorage.getItem("Amount")
  const Currency = localStorage.getItem("Currency")

  useEffect(() => {
    showToast(`Your last transaction for an amount of ${Amount} ${Currency} was Failed!`, "error")
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', marginTop: '4rem' }}>
        <img
          src={FailureImage}
          alt="Failure Illustration"
          style={{ width: '500px', height: "400px" }}
        />
      </div>

      <span className='payment-failure-text' style={{ fontWeight: 450, fontSize: '1.4em', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        Your last transaction for an amount of&nbsp;
        <span style={{ fontWeight: 800, fontSize: '1.2em' }}>{Amount}</span>&nbsp;
        <span style={{ fontWeight: 800, fontSize: '1.2em' }}>{Currency}</span>&nbsp;
        was
        <span style={{ fontWeight: 800, fontSize: '1.2em' }}>&nbsp;Failed.</span>&nbsp;Please try again.
      </span>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "2rem" }}>
        <span>
          <a href='https://www.afltexas.com' >Go back to afltexas</a>
        </span>
      </div>
    </>

  )
}

export default FailurePage;