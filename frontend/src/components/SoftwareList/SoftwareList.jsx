import { useEffect, useState } from 'react';
import { Link }  from 'react-router-dom';

export default function SoftwareList() {
    const [softwares, setSoftware] = useState([]);
    useEffect(() => {
        const fetchSoftware = async () => {
            try {
                const getSoftwares = await fetch('http://localhost:3001/api/softwares', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
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
    return (
        <div className="software-list">
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
        </div>
    );
}