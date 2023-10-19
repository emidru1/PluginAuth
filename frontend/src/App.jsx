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
import Software from './components/Software/Software';
import AddSoftware from './components/SoftwareList/AddSoftware';
import User from './components/User/User';
import UserList from  './components/UserList/UserList';
import License from './components/License/License';
import LicenseList from './components/LicenseList/LicenseList';
import AddLicense from './components/LicenseList/AddLicense';
import EditLicense from './components/License/EditLicense';
import EditSoftware from './components/Software/EditSoftware';

function App() {
  const { token, setToken, removeToken } = useToken();

  return (
    <Router>
      {!token ? (
        <div>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<SignUp setToken={setToken}/>} />
          <Route path="*" element={<Login setToken={setToken} />} /> 
        </Routes>
      </div>
      ) : (
        <>
          <NavBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/softwares" element={<SoftwareList />} />
            <Route path="/softwares/:_id" element={<Software />} />
            <Route path="/softwares/addsoftware" element={<AddSoftware />}/>
            <Route path="/softwares/edit/:_id" element={<EditSoftware />}/>
            <Route path="/licenses/" element={<LicenseList />} />
            <Route path="/softwares/:softwareId/users/:userId/licenses/:_id" element={<License />} />
            <Route path="/softwares/:softwareId/addLicense" element={<AddLicense />} />
            <Route path="/softwares/:softwareId/users/:userId/licenses/:licenseId/edit" element={<EditLicense/>} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:_id" element={<User />} />
          </Routes>
          <Logout removeToken={removeToken} /> 
        </>
      )}
    </Router>
  );
}

export default App;
