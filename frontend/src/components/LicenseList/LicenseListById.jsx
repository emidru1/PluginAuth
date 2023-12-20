import { useEffect, useState } from 'react';
import * as jwtDecode from 'jwt-decode';

export default function LicenseListById() {
    const [licenses, setLicenses] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const getUserIdFromToken = () => {
        const tokenString = localStorage.getItem('token');
        if (tokenString) {
            try {
                const decoded = jwtDecode.jwtDecode(tokenString);  // Assuming jwtDecode is the correct function
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
                const response = await fetch(`http://localhost:3001/api/users/${userId}/licenses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`  
                    }
                });

                if (!response.ok) throw new Error("Could not retrieve user's license list");
                let userLicenses = await response.json();

                // Fetch software details for each license
                const softwareFetches = userLicenses.map(license => 
                    fetch(`http://localhost:3001/api/softwares/${license.softwareId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                );

                const softwareResponses = await Promise.all(softwareFetches);
                const softwareData = await Promise.all(softwareResponses.map(res => res.json()));

                // Combine license data with software names
                userLicenses = userLicenses.map((license, index) => {
                    return {
                        ...license,
                        softwareName: softwareData[index].name,
                        expirationDate: license.expirationDate // Assuming this field exists
                    };
                });

                setLicenses(userLicenses);
            } catch(err) {
                setFeedbackMessage(err.message);
                console.error(err.message);
            }
        };

        fetchLicenses();
    }, []);

    return (
        <div className='centered-content'>
            <h1>My Licenses</h1>
            {feedbackMessage && <p>{feedbackMessage}</p>}
            <ul>
                {licenses.map((license) => (
                    <li key={license._id}>
                        License Key: {license.key} - Software: {license.softwareName} - Expires on: {license.expirationDate}
                    </li>
                ))}
            </ul>
        </div>
    );
}
