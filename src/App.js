import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </BrowserRouter>
  );
}

export default App;
