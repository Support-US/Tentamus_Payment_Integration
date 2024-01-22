import logo from './logo.svg';
import './App.css';
import awsExports from './aws-exports'
import CustomerPaymentDetailsForm from './Pages/CustomerPaymentDetails/CustomerPaymentDetailsForm';
import { Amplify } from 'aws-amplify';
import SucessPage from './Pages/ResultPages/SucessPage';
import FailurePage from './Pages/ResultPages/FailurePage';

Amplify.configure(awsExports)

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <div>
      <CustomerPaymentDetailsForm/>
      {/* <SucessPage/> */}
      {/* <FailurePage/> */}
    </div>
  );
}

export default App;
