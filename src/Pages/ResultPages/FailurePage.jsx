import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import AFLLogo from "../../images/AFL_Logo.png";
import CFLLogo from "../../images/CFL_Logo.png"
import AdamsonLogo from "../../images/AdamsonLogo.png";
import TentamusLogo from "../../images/tentamus.png";

import { showToast } from '../../Components/ToastUtils';
import CurrencyFormat from '../../Components/CurrencyFormat';
import { Button } from '@mui/material';
import { ArrowBackOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
// import { BlowfishEncryption } from '../../Components/BlowfishEncryption';

const FailurePage = () => {
  // const [amountInUSD, setAmountInUSD] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    description: "",
    payID: "",
    merchantID: "",
    clientname: "",
    amount: "",
    currency: "",
  });
  const [computopdetails, setComputopDetails] = useState({
    MerchantID: "",
    datalength: "",
    encryptedstring: "",
    amount: "",
    currency: "",
    invoicenumbers: "",
    firstname: "",
    clientname: "",
    lastname: "",
    phonenumber: "",
    addressline1: "",
    city: "",
    state: "",
    postalcode: "",
    country: "",
    transid: "",
  });
  const [srcLogo, setSrcLogo] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [logoStyle, setLogoStyle] = useState({ width: '80px', height: 'auto' });
  const [websiteURL, setWebsiteURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const apiUrl = process.env.REACT_APP_GET_PAYMENT_DETAILS_API;

  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const transId = searchParams.get('TransID');
      const payId = searchParams.get('PayID');
      const mac = searchParams.get('MAC');
      const code = searchParams.get('Code');
      const status = searchParams.get('Status');
      const mid = searchParams.get('mid');


      if (transId && payId && mac && code && status && mid) {

        const data = { id: transId, payId: payId, mac: mac, code: code, status: status, mid: mid };

        try {
          await axios.post(apiUrl,
            JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json'
            },
          })
            .then(response => {
              const responseData = response.data;
              // console.log("responseData", responseData);

              setPaymentDetails({
                description: searchParams.get('Description'),
                merchantID: searchParams.get('mid'),
                payID: searchParams.get('PayID'),
                clientname: responseData.ClientName,
                amount: responseData.Amount,
                currency: responseData.Currency,
              });

              switch (responseData.ClientName) {
                // case 'Analytical Food Laboratories':
                //   setSrcLogo(AFLLogo);
                //   setCompanyName('Analytical Food Laboratories');
                //   setWebsiteURL("https://www.afltexas.com");
                //   break;

                case 'Columbia Laboratories':
                  setSrcLogo(CFLLogo);
                  setCompanyName('Columbia Laboratories');
                  setLogoStyle({ width: '170px', height: 'auto' });
                  setWebsiteURL("https://www.columbialaboratories.com");
                  break;

                case 'Tentamus North America Virginia':
                  setSrcLogo(TentamusLogo);
                  setCompanyName('Tentamus North America Virginia');
                  setLogoStyle({ width: '170px', height: 'auto' });
                  setWebsiteURL("https://www.tentamus-va.com/");
                  break;

                case 'Adamson Analytical Labs':
                  setSrcLogo(AdamsonLogo);
                  setCompanyName('Adamson Analytical Labs');
                  setLogoStyle({ width: '170px', height: 'auto' });
                  setWebsiteURL("https://www.adamsonlab.com/");
                  break;
              }
              setLoading(false);
            })
            .catch(error => {
              setLoading(false);
              setShowError(true);
            })
        }
        catch (error) {
          setLoading(false);
          setShowError(true);
          console.log("fetchPaymentDetails error", error);
          showToast("Data fetch error", "error");
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (computopdetails.MerchantID !== "") {
      handleComputopRedirection();
    }
  }, [computopdetails])

  const getformdetails = async () => {
    setButtonLoading(true);
    const searchParams = new URLSearchParams(location.search);
    const transId = searchParams.get('TransID');
    const payId = searchParams.get('PayID');
    const mac = searchParams.get('MAC');
    const code = searchParams.get('Code');
    const status = searchParams.get('Status');
    const mid = searchParams.get('mid');

    if (transId && payId && mac && code && status && mid) {

      const data = { id: transId, payId: payId, mac: mac, code: code, status: status, mid: mid };

      const customHeaders = {
        'X-Retry': 'true'
      };

      try {
        const failureresponse = await axios.post(
          apiUrl,
          JSON.stringify(data),
          {
            headers: {
              'Content-Type': 'application/json',
              ...customHeaders
            }
          }
        )
          .then(response => {
            const responseData = response.data;
            // console.log("failureresponse", responseData);

            setComputopDetails({
              MerchantID: responseData.MerchantID,
              datalength: responseData.Length,
              encryptedstring: responseData.EncryptedString,
              amount: responseData.Amount,
              currency: responseData.Currency,
              clientname: responseData.ClientName,
              invoicenumbers: responseData.InvoiceNumbers,
              firstname: responseData.FirstName,
              lastname: responseData.LastName,
              addressline1: responseData.AddressLine1,
              city: responseData.City,
              state: responseData.State,
              postalcode: responseData.PostalCode,
              country: responseData.Country,
              phonenumber: responseData.PhoneNumber,
              transID: responseData.TransID
            });
            setButtonLoading(false);
          })
          .catch(error => {
            setButtonLoading(false);
            setShowError(true);
          })
      } catch (error) {
        setButtonLoading(false);
        console.log("fetchFormDetails error", error);
        showToast("Data fetch error", "error");
      }
    }
  }


  const handleComputopRedirection = () => {
    const { MerchantID, datalength, encryptedstring, transID, firstname, lastname, addressline1, city, state, postalcode, country, phonenumber, currency } = computopdetails;
    const customField1 = CurrencyFormat(computopdetails.amount);

    const customField3 =
      companyName === 'Analytical Food Laboratories'
        ? 'https://www.afltexas.com/wp-content/uploads/2022/07/AFL_GroupTag.svg'
        : companyName === 'Columbia Laboratories'
          ? 'https://www.columbialaboratories.com/wp-content/uploads/2022/09/CL_GroupTag_horizontal.svg'
          : companyName === 'Adamson Analytical Labs'
            ? 'https://www.adamsonlab.com/wp-content/uploads/2023/06/logo.svg'
            : companyName === 'Tentamus North America Virginia'
              ? 'https://www.tentamus.com/wp-content/uploads/2021/07/tentamus-group-logo.svg'
              : undefined;

    // console.log("customField3", customField3);

    const combinedInvoices = Object.values(computopdetails.invoicenumbers);
    const customField4 = combinedInvoices.join("%0A");

    // console.log("handleComputopRedirection", computopdetails);

    window.location.href = `https://www.computop-paygate.com/payssl.aspx?MerchantID=${MerchantID}&Len=${datalength}&Data=${encryptedstring}&CustomField1=${customField1} ${currency}&CustomField3=${customField3}&CustomField4=${customField4}&CustomField5=${firstname}%20${lastname}%0A${addressline1}%0A${city}%0A${state}%0A${postalcode}%0A${country}%0A${phonenumber}&CustomField7=${transID}`;

  }


  return (
    <>
      {
        (!loading && paymentDetails.amount !== '') &&
        <>
          <ToastContainer />

          <span className='payment-failure-text'>
            Your payment for {CurrencyFormat(paymentDetails.amount)} {paymentDetails.currency}
          </span>
          <span className='failure-text'> Failed!</span >

          <div className="wrapper">
            <svg className="crossmark addClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="100" height="100">
              <circle className="crossmark__circle animateElement" cx="26" cy="26" r="25" fill="none" />
              <path className="cross__path cross__path--right animateElement" fill="none" d="M16,16 l20,20" />
              <path className="cross__path cross__path--left animateElement" fill="none" d="M16,36 l20,-20" />
            </svg>
          </div>


          <div className='flex justify-content-center gap-2'
            style={{ color: "var(--primary-color)", marginTop: "-12rem", marginBottom: "2rem", marginLeft: "10rem" }}
          >

            <table>
              <tbody>
                <tr>
                  <th className="text-left" style={{ fontWeight: 450, fontSize: '1.2em' }}>Description</th>
                  <td style={{ padding: '0 10px' }}>:</td>
                  <td style={{ fontWeight: 600, fontSize: '1.2em', padding: '0 10px' }}>{paymentDetails.description}</td>
                </tr>
                <tr>
                  <th className="text-left" style={{ fontWeight: 450, fontSize: '1.2em' }}>Merchant ID</th>
                  <td style={{ padding: '0 10px' }}>:</td>
                  <td style={{ fontWeight: 600, fontSize: '1.2em', padding: '0 10px' }}>{paymentDetails.merchantID}</td>
                </tr>
                <tr>
                  <th className="text-left" style={{ fontWeight: 450, fontSize: '1.2em' }}>Pay ID</th>
                  <td style={{ padding: '0 10px' }}>:</td>
                  <td style={{ fontWeight: 600, fontSize: '1.2em', padding: '0 10px' }}>{paymentDetails.payID}</td>
                </tr>

              </tbody>
            </table>

          </div>


          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem', marginBottom: '4rem' }}>
            {
              buttonLoading === true ?
                <>
                  <Button
                    variant="contained"
                    color="success"
                    size='small'
                    disabled
                    style={{ textTransform: "capitalize", fontWeight: 600 }}
                  >
                    Forwading to payment...
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
                    onClick={getformdetails}
                  >
                    Return to Payment
                  </Button>
                </>
            }
          </div>

          <div className='mt-5 flex justify-content-center align-items-center gap-3 sm:gap-5' style={{ textAlign: 'center' }}>
            {srcLogo && (
              <a href={websiteURL} target="_blank" rel="noopener noreferrer">
                <img src={srcLogo} style={logoStyle} alt={`${companyName} Logo`} />
              </a>
            )}
          </div>

          <div>
            <span style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              marginTop: '0.5rem',
              fontWeight: 600,
              color: 'var(--primary-color)',
              fontSize: '15px',
            }}>
              {companyName}
            </span>

          </div>

        </>
      }

      {
        loading &&
        <>
          <div className="overlays mb-3">
            <div className="overlay__inner">
              <div className="overlay__content">
                <span className="spinner"></span>
              </div>
              <span className='flex justify-content-center align-items-center h-screen mt-5'>
                Payment Processing ...
              </span>
            </div>
          </div>
        </>
      }

      {
        (!loading && showError) &&
        <>
          <span className='flex flex-column justify-content-center align-items-center h-screen'>

            <h1 className='text-2xl font-bold text-center' style={{ color: "#4CAF50" }}>
              Something went wrong :( <br /> Please try again
            </h1>

            <Button
              variant='outlined'
              color="success"
              className='mt-3'
              // size='small'
              style={{ textTransform: 'none', fontWeight: 600 }}
              onClick={() => window.location.href = "/"}>
              Go to Home
            </Button>
          </span>
        </>
      }
    </>
  )
}

export default FailurePage;




