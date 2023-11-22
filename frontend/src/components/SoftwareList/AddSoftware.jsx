import { useState } from 'react';

export default function AddSoftware () {
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [name, setName] = useState('');
    const [version, setVersion] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            name: name,
            version: version,
            description: description,
            price: price
        }

        try {
            const response = await fetch('https://pluginauth-d6d40867cfab.herokuapp.com/api/softwares', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToSend)
            });

            if(!response.ok) throw new Error("Could not add new software to the database");

            const result = await response.json();

            console.log(result.message);
            setFeedbackMessage(result.message);
        } catch(err) {
            console.log(err)
        }

    }
    return(
        <div className="create-software">
            <h1>Create new software</h1>
            {feedbackMessage && <p>{feedbackMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Name</p>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}/>
                </label>
                <label>
                    <p>Version</p>
                    <input type="text" value={version} onChange={e => setVersion(e.target.value)}/>
                </label>
                <label>
                    <p>Description</p>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)}/>
                </label>
                <label>
                    <p>Price</p>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)}/>
                </label>
                
                <div className="add-software-submit">
                    <button type="submit">Submit</button>
                </div>
            </form>

        </div>
    );
}