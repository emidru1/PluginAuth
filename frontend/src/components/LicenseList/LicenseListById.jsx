import { useEffect, useState } from 'react';
import * as jwtDecode from 'jwt-decode';  // Corrected import

export default function LicenseListById() {
    const [licenses, setLicenses] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const getUserIdFromToken = () => {
        const tokenString = localStorage.getItem('token');
        console.log(tokenString.token);
        if (tokenString) {
            try {
                const decoded = jwtDecode.jwtDecode(tokenString);  // Corrected token decoding
                console.log(decoded);
                return decoded.userId;
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchLicenses = async () => {
            const userId = getUserIdFromToken();
            if (!userId) {
                console.error("User ID not found");
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`https://pluginauth-d6d40867cfab.herokuapp.com/api/users/${userId}/licenses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`  
                    }
                });

                if (!response.ok) throw new Error("Could not retrieve user's license list");
                const userLicenses = await response.json();
                setLicenses(userLicenses);
            } catch(err) {
                setFeedbackMessage(err.message);
                console.error(err.message);
            }
        };

        fetchLicenses();
    }, []);

    return (
        <div className="licenses-by-id">
            <h1>My Licenses</h1>
            {feedbackMessage && <p>{feedbackMessage}</p>}
            <ul>
                {licenses.map((license) => (
                    <li key={license._id}>
                        License Key: {license._id} - Software ID: {license.softwareId}
                        {/* Add more license details as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
}
