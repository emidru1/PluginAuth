// In NavBar.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App/UserContext';

// eslint-disable-next-line react/prop-types, no-unused-vars
export default function NavBar({ token, setToken, removeToken }) {
    const user = useContext(UserContext);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            removeToken();
        }
    }

    return (
        <div className='navbar'>
            <ul className='navbar-list'>
                {/* Common Links */}
                <li><Link to='/'>Dashboard</Link></li>
                {token ? (
                    <>
                        <li><Link to='/softwares'>Software</Link></li>
                        <li><Link to='/mylicenses'>My Licenses</Link></li>
                        {/* Admin Only Links */}
                        {user && user.role === 'admin' && (
                            <>
                                <li><Link to='/users'>Users</Link></li>
                                <li><Link to='/licenses'>Licenses</Link></li>
                            </>
                        )}
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/signup'>Signup</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
}
