import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export default function EditSoftware() {
    const { _id } = useParams();
    const location = useLocation();
    const software = location.state?.software || {};
    const { name, version, description, price } = software;
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [softwareName, setSoftwareName] = useState(name);
    const [softwareVersion, setSoftwareVersion] = useState(version);
    const [softwareDescription, setSoftwareDescription] = useState(description);
    const [softwarePrice, setSoftwarePrice] = useState(price);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToUpdate = {
            _id: _id,
            name: softwareName,
            version: softwareVersion,
            description: softwareDescription,
            price: softwarePrice
        }
        try {
            const response = await fetch('http://localhost:3001/api/softwares', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToUpdate)
            })
            if(!response.ok) throw new Error("Could not update software entry in the database");
    
            const result = await response.json();
            console.log('Software edited successfully:', result);
            setFeedbackMessage(result.message);
        } catch (err) {
            console.log(err)
        }
    }
    return (
       <div className='edit-software'>
         <h1>Edit software - {name}</h1>
         {feedbackMessage && <p>{feedbackMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Name</p>
                    <input type="text" value={softwareName} onChange={e => setSoftwareName(e.target.value)}/>
                </label>
                <label>
                    <p>Version</p>
                    <input type="text" value={softwareVersion} onChange={e => setSoftwareVersion(e.target.value)}/>
                </label>
                <label>
                    <p>Description</p>
                    <input type="text" value={softwareDescription} onChange={e => setSoftwareDescription(e.target.value)}/>
                </label>
                <label>
                    <p>Price</p>
                    <input type="number" value={softwarePrice} onChange={e => setSoftwarePrice(e.target.value)}/>
                </label>
                
                <div className="add-software-submit">
                    <button type="submit">Submit</button>
                </div>
            </form>
       </div>
    );
}