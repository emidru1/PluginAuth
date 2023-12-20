import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './License.css';
import RemoveLicense from './RemoveLicense';

export default function License() {
    const { _id, softwareId, userId } = useParams();
    const [license, setLicense] = useState(null);
    const [user, setUser] = useState(null);
    const [software, setSoftware] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLicenseData = async () => {
            if(!_id) {
                console.error("License ID is not defined");
                return;
            }
            try {
                const licenseResponse = await fetch(`http://localhost:3001/api/softwares/${softwareId}/users/${userId}/licenses/${_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(!licenseResponse.ok) throw new Error("Could not fetch license data");
                const licenseData = await licenseResponse.json();
                setLicense(licenseData);

                // Fetch User Data
                const userResponse = await fetch(`http://localhost:3001/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(!userResponse.ok) throw new Error("Could not fetch user data");
                const userData = await userResponse.json();
                setUser(userData);

                // Fetch Software Data
                const softwareResponse = await fetch(`http://localhost:3001/api/softwares/${softwareId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(!softwareResponse.ok) throw new Error("Could not fetch software data");
                const softwareData = await softwareResponse.json();
                setSoftware(softwareData);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLicenseData();
    }, [_id, softwareId, userId]);

    const handleBackClick = () => {
        navigate(-1);
    };
    const handleEditClick = () => {
        navigate(`/softwares/${license.softwareId}/users/${license.userId}/licenses/${license._id}/edit`, { state: { license }});
    };

    return (
        <div className='centered-content'>
            <h1>License Details</h1>
            {license && (
                <ul>
                    <li>License ID: {_id}</li>
                    <li>Software ID: {softwareId} - {software?.name}</li>
                    <li>User ID: {userId} - {user?.email}</li>
                    <li>Expiration Date: {license.expirationDate}</li>
                    <li>Key: {license.key}</li>
                </ul>
            )}
            <RemoveLicense />
            <button onClick={handleBackClick}>Back</button>
            <button onClick={() => handleEditClick(license)}>Edit</button>
        </div>
    );
}
