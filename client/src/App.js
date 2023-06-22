import './App.css';
import { useSelector } from 'react-redux';
import { AllRoutes } from './Routes/AllRoutes';

function App() {

  const {
    isLoading,
  } = useSelector(state => state.app)

  return (
    <div className="App">
      {/* <Header /> */}
      <AllRoutes />
      {/* <Footer /> */}


      {/* {
        isLoading === true && <Spinner />
      }
      {
        isError === true && <Error />
      }
      {
        isAlert.status === true && <Alert />
      } */}
    </div>
  );
}

export default App;
