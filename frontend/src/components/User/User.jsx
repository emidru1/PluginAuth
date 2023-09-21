import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './User.css';

export default function User() {
    const { _id } = useParams();
    const [ user, setUser ] = useState(null);
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
                    'Content-Type': 'application/json'
                }
            })
            if (!userData.ok) throw new Error("Could not fetch user data");
            const data = await userData.json();
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
                        <p>{user.email}</p>
                        <p>{user.role}</p>
                        <p>{user.createdAt}</p>
                    </li>
                </ul>
            )}
        <button onClick={handleClick}>Back</button>
        </div>
    );
}