// eslint-disable-next-line no-unused-vars
import Reach from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className='navbar'>
            <ul className='navbar-list'>
                <li><Link to='/'>Dashboard</Link></li>
                <li><Link to='/profile'>Profile</Link></li>
                <li><Link to='/pricing'>Pricing</Link></li>
            </ul>
        </div>
    );
};

export default NavBar;
