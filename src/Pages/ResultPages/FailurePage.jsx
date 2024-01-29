import React, { useEffect } from 'react'
import FailureImage from './FailureImage.png'
// import FailureImage from './FailureImage2.jpg'
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FailurePage = () => {
  useEffect(() => {
    const Tid = localStorage.getItem("Tid")
    toast.error(`Your payment was Failed for Transcation Id: ${Tid}`, {
      position: "top-center",
      autoClose: 3000,
      // hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Slide
    })
    console.log("ID-- ", Tid);
  }, [])
  return (

    <>
      <ToastContainer />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', marginTop: '8rem' }}>
        <img
          src={FailureImage}
          alt="Success Illustration"
          style={{ maxWidth: '100%', maxHeight: '50vh' }}
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