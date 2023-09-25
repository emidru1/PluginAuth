import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import  './Software.css';

export default function Software() {
    const { _id } = useParams();
    const [software, setSoftware] = useState(null);
    const { name, version, description, price } = software || {};

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
        navigate(-1);
        
    };
    const handleEditClick = () => {
        navigate(`/softwares/edit/${software._id}`, { state: { software }});
    }
    return (
        <div className="software-details">
            <h1>Software Details</h1>
            {software && (
                <ul>
                    <li>
                        <p>Name: {name}</p>
                        <p>Version: {version}</p>
                        <p>Description: {description}</p>
                        <p>Price: ${price}</p>
                    </li>
                </ul>
            )}
            <button onClick={handleClick}>Back</button>
            <button onClick={() => handleEditClick(software)}>Edit</button>
        </div>
    );
}