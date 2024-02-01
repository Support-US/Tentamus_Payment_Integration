import React, { useEffect } from 'react'
import SucessImage from "./SuccessImage.jpg"
// import image from "./image.png"
import { ToastContainer} from 'react-toastify';
import AFLLogo from "../../images/AFL_Logo.png";
import ConfettiEffect from './ConfettiEffect';
import { showToast } from '../../Components/ToastUtils';

const SuccessPage = () => {
  useEffect(() => {
    // const Tid = localStorage.getItem("Tid")
    showToast("Your last transaction was successful","success")
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
        <img
          src={SucessImage}
          // src={image}
          alt="Success Illustration"
          style={{ width: '550px', height:"400px" }}
        />
      </div>

      <span className='payment-success-text'  style={{ fontSize: '30px', color: 'green' }}>Payment Successful</span>




      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "2rem" }}>
        <span>
          <a href='https://www.afltexas.com' >Go back to afltexas</a>
        </span>
      </div>

    </>
  )
}

export default SuccessPage;