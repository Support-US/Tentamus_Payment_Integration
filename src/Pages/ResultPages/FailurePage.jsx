import React, { useEffect } from 'react'
import FailureImage from './FailureImage.png'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AFLLogo from "../../images/AFL_Logo.png";
import { showToast } from '../../Components/ToastUtils';


const FailurePage = () => {
  useEffect(() => {
    // const Tid = localStorage.getItem("Tid")
    showToast("Your last transaction was Failed!", "error")
    // console.log("ID-- ", Tid);
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
          style={{ width: '500px', height:"400px" }}
        />
      </div>

      <span className='payment-failure-text'>Payment transaction failed. Please try again.</span>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "2rem" }}>
        <span>
          <a href='https://www.afltexas.com' >Go back to afltexas</a>
        </span>
      </div>
    </>

  )
}

export default FailurePage;