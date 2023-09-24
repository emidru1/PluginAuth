import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export default function EditLicense () {
    const { _id } = useParams();
    const location = useLocation();
    const license = location.state?.license || {};
    const { softwareId = "", userId = "", expirationDate = "", key = "" } = license;

    const [users, setUsers] = useState([]);
    const [softwares, setSoftwares] = useState([]);
    const [softId, setSoftId] = useState(softwareId);
    const [uId, setUId] = useState(userId);
    const [licenseKey, setLicenseKey] = useState(key);
    const [licenseDuration, setLicenseDuration] = useState("");
    const [expiration, setExpiration] = useState(expirationDate);
    const [feedbackMessage, setFeedbackMessage] = useState('');

            //Should move these methods for fetching to a different component made for that purpose (method reusing)
            const loadUsers = async () => {
                try {
                    const fetchUsers = await fetch('http://localhost:3001/api/users', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!fetchUsers.ok) throw new Error("Could not fetch users");
                    const data = await fetchUsers.json();
                    setUsers(data);
                } catch(err) {
                    console.log(err);
                }
            }
            const loadSoftwares = async () => {
                try {
                    const fetchSoftwares = await fetch('http://localhost:3001/api/softwares', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if(!fetchSoftwares) throw new Error("Could not fetch softwares");
                    const data = await fetchSoftwares.json();
                    setSoftwares(data);
                } catch(err) {
                    console.log(err);
                }
            }
            const handleGenerateAndSetExpiry = (event) => {
                event.preventDefault();
                let key = '';
                const characters = '0123456789abcdef';
                for (let i = 0; i < 24; i++) {
                    key += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                setLicenseKey(key);
                const expiry = computeExpiryDate(licenseDuration);
                setExpiration(expiry);
                console.log("License will expire on:", expiry);
            }
            const computeExpiryDate = (hours) => {
                const currentDate = new Date();
                currentDate.setHours(currentDate.getHours() + Number(hours));
                return currentDate.toISOString();
            };
            const handleSubmit = async (e) => {
                e.preventDefault();
    
                const dataToSend = {
                    _id: _id,
                    softwareId: softId,
                    userId: uId,
                    key: licenseKey,
                    expirationDate: expiration
                };
                try {
                    const response = await fetch('http://localhost:3001/api/licenses', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dataToSend)
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to edit license data');
                    }
                    const result = await response.json();
                    console.log('License edited successfully:', result);
                    setFeedbackMessage(result.message);
                } catch (error) {
                    console.error('Error submitting data:', error);
                }
            }

    useEffect(() => {
            loadSoftwares();
            loadUsers();
    }, []);

    return (
        <div className="edit-license">
            <h1>Edit license - {_id}</h1>
            {feedbackMessage && <p>{feedbackMessage}</p>}
            <form onSubmit={handleSubmit}>
            <label>
                <p>Software ID</p>
                <select value={softId} onChange={e => setSoftId(e.target.value)}>
                    {softwares.map(software => 
                        <option key={software._id} value={software._id}>
                            {software.name}
                        </option>)
                    }
                </select>
            </label>
                <br />
            <label>
                <p>User ID</p>
                <select value={uId} onChange={e => setUId(e.target.value)}>
                        {users.map(user => 
                            <option key={user._id} value={user._id}>
                                {user.email}
                            </option>)
                        }
                </select>
            </label>
            <label>
                <p>Key valid for</p>
                <select value={licenseDuration} onChange={e => setLicenseDuration(e.target.value)}>
                    <option value="24">1 day</option>
                    <option value="72">3 days</option>
                    <option value="168">7 days</option>
                    <option value="360">15 days</option>
                    <option value="720">1 month</option>
                    <option value="2160">3 months</option>
                </select>
            </label>
                <label>
                    <p>Key</p>
                    <input type="text" value={licenseKey} readOnly/>
                    <br />
                    <button onClick={e => handleGenerateAndSetExpiry(e)}>Generate</button>
                </label>
                    <div className="edit-license-submit">
                        <button type="submit">Submit</button>
                    </div>
            </form>
        </div>
    );
}