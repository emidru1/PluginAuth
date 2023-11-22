import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './User.css';

export default function User() {
    const { _id } = useParams();
    const [user, setUser] = useState({ email: '', role: '', licenses: [], softwares: [] });
    const { email, role, softwares, licenses } = user || {};
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if(!_id) {
                console.error("User ID is not defined");
                return;
            }
            try {
                const userData = await fetch(`http://localhost:3001/api/users/${_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!userData.ok) throw new Error("Could not fetch user data");
            const data = await userData.json();
            console.log(data);
            setUser(data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchUserData();
    }, [_id]);
    const handleClick = () => {
        navigate(-1);
    }
    return(
        <div className="user-details">
            <h1>User details</h1>
            { user && (
                <ul>
                    <li>
                        <p>{email}</p>
                        <p>{role}</p>
                    </li>
                </ul> 
            )}
            <h1>User License list</h1>
            { licenses && 
                <ul>
                    { 
                        licenses.map((license) => (
                            <li key={license._id}>
                                <Link to={`/softwares/${license.softwareId}/users/${license.userId}/licenses/${license._id}`}>{license.key}</Link>
                            </li>
                        ))
                    }
                </ul>
            }
            <h1>Software list</h1>
            { softwares && 
                <ul>
                    {
                        softwares.map((software) => (
                            <li key={software._id}>
                                <Link to={`/softwares/${software._id}`}>{software.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            }

            
        <button onClick={handleClick}>Back</button>
        </div>
    );
}