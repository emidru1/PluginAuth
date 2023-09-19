// eslint-disable-next-line no-unused-vars
import React, {useState} from "react";
import PropTypes from "prop-types";
import "./Login.css";
import { Link } from 'react-router-dom';
async function loginUser(credentials) {
    return fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };

export default function Login({setToken}) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            email,
            password
        });
        setToken(token);
    }
    return (
        <div className="login-form">
            <form onSubmit={handleSubmit}>
            <label>
                <p>Email</p>
                <input type="email" onChange={e => setEmail(e.target.value)}/>
            </label>
            <label>
                <p>Password</p>
                <input type="password" onChange={e => setPassword(e.target.value)}/>
            </label>
            <div className="login-submit">
                <button type="submit">Submit</button>
            </div>
            <p>Not a member yet? <Link to="/signup">Sign Up</Link></p>
        </form>
        </div>
    );
}