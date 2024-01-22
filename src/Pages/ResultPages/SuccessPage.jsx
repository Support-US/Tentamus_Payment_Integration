import React from 'react'
import SucessImage from "./SuccessImage.jpg"


const SuccessPage = () => {
  return (
    <>
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