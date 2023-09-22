import { useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './LicenseList.css';
import AddLicense from '../AddLicense/AddLicense';

export default function LicenseList() {
    const [licenses, setLicenses] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchLicenses = async () => {
            try {
                const getSoftwareList = await fetch('http://localhost:3001/api/licenses', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!getSoftwareList.ok) throw new Error("Could not retrieve software list");
                const softwareList = await getSoftwareList.json();
                setLicenses(softwareList);
            } catch(err) {
                console.log(err);
            }
        }
        fetchLicenses();
    },[]);
    const handleAddLicense = () => {
        navigate('/licenses/addlicense');
    }
    return(
        <div className="license-list">
            <h1>License list</h1>
            <button onClick={handleAddLicense}>Add License</button>
            <ul>
                { 
                    licenses.map((license) => (
                        <li key={license._id}>
                            <Link to={`/licenses/${license._id}`}>{license.key}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}