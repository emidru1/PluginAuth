import { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './LicenseList.css';
export default function LicenseList() {
    const [licenses, setLicenses] = useState([[]]);
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
    return(
        <div className="license-list">
            <h1>License list</h1>
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