import React from 'react'
// import FailureImage from './FailureImage.png'
import FailureImage from './FailureImage2.jpg'

const FailurePage = () => {
  return (
  
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',marginTop:'10x' }}>
    <img
     src={FailureImage}
     alt="Failure Illustration"
     style={{ maxWidth: '100%', height: 'auto', maxHeight: '70vh' }}
    />
  </div>

  )
}

export default FailurePage;