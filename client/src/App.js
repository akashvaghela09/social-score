import './App.css';
import { useSelector } from 'react-redux';
import { Alert } from './Components/Alert';
import { Error } from './Components/Error';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header/Header';
import { Spinner } from './Components/Spinner';
import { AllRoutes } from './Routes/AllRoutes';

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_hGedFGmWbUzrw1UJf3b8S-U4eX7ALUs",
  authDomain: "social-score-17f87.firebaseapp.com",
  projectId: "social-score-17f87",
  storageBucket: "social-score-17f87.appspot.com",
  messagingSenderId: "993435366168",
  appId: "1:993435366168:web:02169917dd8cb2a2dee46d"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);


function App() {
  const {
    isError,
    isLoading,
    isAlert
  } = useSelector(state => state.app)

  return (
    <div className="App">

      <Header />
      <AllRoutes />
      {/* <Footer /> */}
      {
        isLoading === true && <Spinner />
      }
      {/* {
        isError === true && <Error />
      }
      {
        isAlert.status === true && <Alert />
      } */}
    </div>
  );
}

export default App;
