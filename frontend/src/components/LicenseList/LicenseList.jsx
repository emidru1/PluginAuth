import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LicenseList.css';

export default function LicenseList() {
    const [licenses, setLicenses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLicenses = async () => {
            try {
                const licenseResponse = await fetch('http://localhost:3001/api/licenses', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!licenseResponse.ok) throw new Error("Could not retrieve license list");
                const licenseList = await licenseResponse.json();

                const enrichedLicenses = await Promise.all(licenseList.map(async (license) => {
                    const userResponse = await fetch(`http://localhost:3001/api/users/${license.userId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const softwareResponse = await fetch(`http://localhost:3001/api/softwares/${license.softwareId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    const user = await userResponse.json();
                    const software = await softwareResponse.json();

                    return { ...license, userEmail: user.email, softwareName: software.name };
                }));

                setLicenses(enrichedLicenses);
            } catch(err) {
                console.log(err);
            }
        };
        fetchLicenses();
    }, []);

    const handleAddLicense = () => {
        navigate('/softwares/:softwareId/addLicense');
    };

    return (
        <div className='centered-content'>
            <h1>License List</h1>
            <ul>
                {licenses.map((license) => (
                    <li key={license._id}>
                        <Link to={`/softwares/${license.softwareId}/users/${license.userId}/licenses/${license._id}`}>
                            {license.softwareName} - {license.userEmail} - {license.key}
                        </Link>
                    </li>
                ))}
            </ul>
            <button onClick={handleAddLicense}>Add License</button>
        </div>
    );
}
