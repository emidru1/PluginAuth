// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default function Logout({ removeToken }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            removeToken();
            navigate('/');
        }
    }

    return (
        <div className='logout-button'>
            <button onClick={handleClick}>Logout</button>
        </div>
    );
}
