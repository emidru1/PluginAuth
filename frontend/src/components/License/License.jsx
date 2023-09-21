import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './License.css';

export default function License() {
    const { _id } = useParams();
    const [ license, setLicense ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLicenseData = async () => {
        if(!_id) {
            console.error("License ID is not defined");
            return;
        }
        try {
            const licenseData = await fetch(`http://localhost:3001/api/licenses/${_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!licenseData.ok) throw new Error("Could not fetch license data");
        const license = await licenseData.json();
        setLicense(license);
    } catch (err) {
            console.log(err);
        }
    }
    fetchLicenseData();
    },[_id]);
    const handleClick = () => {
        navigate(-1);
    };
    return(
        <div className="license-details">
            <h1>License details</h1>
            {license && (
                <ul>
                    <li>
                        <p>License ID: {license._id}</p>
                        <p>Software ID: {license.softwareId}</p>
                        <p>User ID: {license.userId}</p>
                        <p>Expiration date: {license.expirationDate}</p>
                        <p>Key: {license.key}</p>
                        <p>Created at: {license.createdAt}</p>
                    </li>
                </ul>
            )}
            <button onClick={handleClick}>Back</button>
        </div>
    );
}