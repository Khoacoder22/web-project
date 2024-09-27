import { AuthProvider } from './contexts/AuthContext';
import './App.css';
// layout
import Layout from './component/layout';
import Productcard from './component/Productcard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

// pages
import Home from "./pages/home"; 
import Shop from "./pages/shop"; 
import { Register } from './pages/Register';
import Login from './pages/Login';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/home" element={<Home />} /> 
            <Route path="/shop" element={<Shop />} /> 
            <Route path="/Register" element={<Register/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/Productcard" element={<Productcard />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
