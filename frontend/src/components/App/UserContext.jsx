// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from 'react';
import * as jwtDecode from 'jwt-decode';

export const UserContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children, token }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode.jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Error decoding token:", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [token]);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};