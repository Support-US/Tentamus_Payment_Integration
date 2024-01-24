import React, { useEffect } from 'react'
import SucessImage from "./SuccessImage.jpg"
import { ToastContainer, toast ,Slide} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SuccessPage = () => {
  useEffect(() => {
     const Tid =localStorage.getItem("Tid")
    toast.success(`Your payment was sucessfull for Transcation Id: ${Tid}`, {
      position: "top-center",
      autoClose: 3000,
      // hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Slide})
    }, [])

    return (
      <>
        <ToastContainer />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', marginTop: '8rem' }}>
          <img
            src={SucessImage}
            alt="Success Illustration"
            style={{ maxWidth: '100%', maxHeight: '50vh' }}
          />
        </div>

        <span className='payment-success-text'>Payment Successful</span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "2rem" }}>
          <span>
            <a href='https://www.afltexas.com' >Go back to afltexas</a>
          </span>
        </div>

      </>
    )
  }

export default SuccessPage;