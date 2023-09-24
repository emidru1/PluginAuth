import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './License.css';
import RemoveLicense from './RemoveLicense';

export default function License() {
    const { _id } = useParams();
    const [ license, setLicense ] = useState(null);
    const { id, softwareId, userId, expirationDate, key, createdAt } = license || {};
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
    const handleBackClick = () => {
        navigate(-1);
    };
    const handleEditClick = () => {
        navigate(`/licenses/edit/${license._id}`, { state: { license }});
    }
    return(
        <div className="license-details">
            <h1>License details</h1>
            {license && (
                <ul>
                    <li>
                        <p>License ID: {_id}</p>
                        <p>Software ID: {softwareId}</p>
                        <p>User ID: {userId}</p>
                        <p>Expiration date: {expirationDate}</p>
                        <p>Key: {key}</p>
                        <p>Created at: {createdAt}</p>
                    </li>
                </ul>
            )}
            <RemoveLicense />
            <button onClick={handleBackClick}>Back</button>
            <button onClick={() => handleEditClick(license)}>Edit</button>
        </div>
    );
}