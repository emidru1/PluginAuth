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
import SoftwareList from './components/SoftwareList/SoftwareList';

function App() {
  const { token, setToken, removeToken } = useToken();

  return (
    <Router>
      {!token ? (
        <div>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<SignUp setToken={setToken}/>} />
          <Route path="*" element={<Login setToken={setToken} />} /> {/* default route */}
        </Routes>
      </div>
      ) : (
        <>
          <NavBar />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/softwares" element={<SoftwareList />} />

          </Routes>
          <Logout removeToken={removeToken} /> 
        </>
      )}
    </Router>
  );
}

export default App;
