import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Software() {
    const { _id } = useParams();
    const [software, setSoftware] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSoftwareData = async () => {
            if(!_id) {
                console.error("Software ID is not defined.");
                return;
            }
            try {
                const softwareData = await fetch(`http://localhost:3001/api/softwares/${_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(!softwareData.ok) throw new Error("Error fetching software data");
                const data = await softwareData.json();
                setSoftware(data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchSoftwareData();
    },[_id]);
    const handleClick = () => {
        navigate(-1); // Return to previous page
    };
    return (
        <div className="software-details">
            <h1>Software Details</h1>
            {software && (
                <ul>
                    <li>
                        <p>Name: {software.name}</p>
                        <p>Version: {software.version}</p>
                        <p>Description: {software.description}</p>
                        <p>Price: ${software.price}</p>
                    </li>
                </ul>
            )}
            <button onClick={handleClick}>Back</button>
        </div>
    );
}