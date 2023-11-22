import { useState, useEffect } from "react";

export default function AddLicense () {
    const [users, setUsers] = useState([]);
    const [softwares, setSoftwares] = useState([]);
    const [softwareId, setSoftwareId] = useState("");
    const [userId, setUserId] = useState("");
    const [licenseKey, setLicenseKey] = useState("");
    const [licenseDuration, setLicenseDuration] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState('');

            //Should move these methods for fetching to a different component made for that purpose (method reusing)
            const loadUsers = async () => {
                try {
                    const fetchUsers = await fetch('https://pluginauth-d6d40867cfab.herokuapp.com/api/users', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                    const fetchSoftwares = await fetch('https://pluginauth-d6d40867cfab.herokuapp.com/api/softwares', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                const expiration = computeExpiryDate(licenseDuration);
                setExpirationDate(expiration);
                console.log("License will expire on:", expiration);
            }
            const computeExpiryDate = (hours) => {
                const currentDate = new Date();
                currentDate.setHours(currentDate.getHours() + Number(hours));
                return currentDate.toISOString();
            };
            const handleSubmit = async (e) => {
                e.preventDefault();
            
                const dataToSend = {
                    softwareId: softwareId,
                    userId: userId,
                    key: licenseKey,
                    expirationDate: expirationDate
                };
            
                try {
                    const response = await fetch('https://pluginauth-d6d40867cfab.herokuapp.com/api/licenses', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(dataToSend)
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to submit license data');
                    }
            
                    const result = await response.json();
                    console.log('Data saved:', result);
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
        <div className="create-license">
            <h1>Create new license</h1>
            {feedbackMessage && <p>{feedbackMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                <p>Software ID</p>
                <select value={softwareId} onChange={e => setSoftwareId(e.target.value)}>
                    <option value="">Select a software</option>
                    {
                        softwares.map(software => <option key={software._id} value={software._id}>{software.name}</option>)
                    }
                </select>
                </label>
                <br />
                <label>
                <p>User ID</p>
                <select value={userId} onChange={e => setUserId(e.target.value)}>
                    <option value="">Select a user</option>
                    {
                        users.map(user => <option key={user._id} value={user._id}>{user.email}</option>)
                    }
                </select>
                </label>
                <label>
                <p>Key valid for</p>
                    <select onChange={e => setLicenseDuration(e.target.value)}>
                        <option value="">Select expiry duration</option>
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
                    <div className="add-license-submit">
                        <button type="submit">Submit</button>
                    </div>
            </form>
        </div>
    );
}