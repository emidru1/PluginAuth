import React from 'react';
import { useNavigate } from 'react-router-dom';

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
