// eslint-disable-next-line no-unused-vars
import Reach from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <div className='navbar'>
            <ul className='navbar-list'>
                <li><Link to='/'>Dashboard</Link></li>
                <li><Link to='/profile'>Profile</Link></li>
                <li><Link to='/pricing'>Pricing</Link></li>
                <li><Link to='/softwares'>Software</Link></li>
            </ul>
        </div>
    );
}
