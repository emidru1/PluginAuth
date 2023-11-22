import { useState } from 'react';
export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        // Directly return the token string without JSON parsing
        return tokenString;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        // Directly store the token string without JSON.stringify
        localStorage.setItem('token', userToken.token);
        setToken(userToken.token);
    };

    const removeToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return {
        setToken: saveToken,
        removeToken,
        token
    };
}

