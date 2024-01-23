import React from 'react'
import FailureImage from './FailureImage.png'
// import FailureImage from './FailureImage2.jpg'

const FailurePage = () => {
  return (

    <>
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