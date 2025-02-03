import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Signin from './pages/Signin'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
  <BrowserRouter>
  <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} style={{ marginTop: "60px" }} />
  </BrowserRouter>
  );
}

export default App