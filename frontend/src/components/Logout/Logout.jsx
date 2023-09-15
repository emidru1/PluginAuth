import React from 'react';
import useToken from '../App/useToken';
import { useNavigate } from 'react-router-dom';

export default function Logout({ removeToken }) {
    const navigate = useNavigate();

    const handleClick = () => {
        removeToken();
        navigate('/');
    }
  return (
    <div className='logout-button'>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}