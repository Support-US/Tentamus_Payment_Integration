import React from 'react'
// import SucessImage from "./SucessImage.jpg"
import SucessImage from "./SucessImage1.jpg"


const SucessPage = () => {
  return (
   
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',marginTop:'10x' }}>
    <img
     src={SucessImage}
     alt="Success Illustration"
     style={{ maxWidth: '100%', height: 'auto', maxHeight: '80vh' }}
    />
  </div>

)
}

export default SucessPage;