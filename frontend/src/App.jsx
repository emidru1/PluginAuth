import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Pricing from './components/Pricing/Pricing';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import useToken from './components/App/useToken';
import Logout from './components/Logout/Logout';

function App() {
  const { token, setToken, removeToken } = useToken();

  return (
    <Router>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <NavBar />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
          <Logout removeToken={removeToken} /> 
        </>
      )}
    </Router>
  );
}

export default App;