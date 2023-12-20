// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

async function signUpUser(credentials) {
    return fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}

SignUp.propTypes = {
    setToken: PropTypes.func.isRequired
};

export default function SignUp({ setToken }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validatePassword(password, confirmPassword)) return;
        const token = await signUpUser({
            email,
            password
        });
        setToken(token);
        navigate('/');

    }

    const validatePassword = (password, confirmPassword) => {
        if (password != confirmPassword) {
            alert('Passwords do not match!');
            return false;
        }
        return true;
    }

    return (
        <div className='centered-content'>
            <form onSubmit={handleSubmit}>
                <label>
                    <p className='centered-content'>Enter your Email address</p>
                    <input type="email" onChange={(e => setEmail(e.target.value))}/>
                </label>
                <label>
                    <p>Enter your Password</p>
                    <input type="password" onChange={(e => setPassword(e.target.value))}/>
                </label>
                <label>
                    <p>Confirm your Password</p>
                    <input type="password" onChange={(e => setConfirmPassword(e.target.value))}/>
                </label>
                <div className="signup-submit">
                    <button type="submit">Submit</button>
                </div>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}