import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const userList = await fetch('http://localhost:3001/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
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
            <ul>
                {
                    users.map((user) => (
                        <li key={user._id}>
                            <Link to={`/users/${users._id}`}>{user._id}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}