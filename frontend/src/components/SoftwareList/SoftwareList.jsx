import { useEffect, useState } from 'react';
import { Link, useNavigate }  from 'react-router-dom';
import './SoftwareList.css';
import { UserContext } from '../App/UserContext';
import { useContext } from 'react';
export default function SoftwareList() {
    const [softwares, setSoftware] = useState([]);
    const navigate = useNavigate();
    const user = useContext(UserContext);

    useEffect(() => {
        const fetchSoftware = async () => {
            try {
                const getSoftwares = await fetch('http://localhost:3001/api/softwares', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if(!getSoftwares.ok) throw new Error("Error fetching software list");
                const softwareList = await getSoftwares.json();
                setSoftware(softwareList);
            } catch(err) {
                console.log(err);
            }
        }
        fetchSoftware();
    },[]);

    const handleAdd = () => {
        navigate('/softwares/addsoftware');
    }
    return (
        <div className='centered-content'>
            <h1>Software list</h1>
            <ul>
                {
                    softwares.map((software) => (
                        <li key={software._id}>
                            <Link to={`/softwares/${software._id}`}>{software.name}</Link>
                        </li>
                    ))
                }
            </ul>
            {user && user.role === 'admin' && (
            <button onClick={handleAdd}>Add Software</button>
            )}
        </div>
    );
}