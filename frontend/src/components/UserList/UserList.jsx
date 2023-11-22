import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserList.css';

export default function UserList() {
    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const userList = await fetch('http://localhost:3001/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(!userList.ok) throw new Error("Could not fetch user list");
            const list = await userList.json();
            setUsers(list);
            } catch(err) { 
                console.log(err);
            }
        }
        fetchUserList();
    }, []);
    return (
        <div className='user-list'>
            <h1>User list</h1>
            <ul>
                {
                    users.map((user) => (
                        <li key={user._id}>
                            <Link to={`/users/${user._id}`}>{user._id}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}