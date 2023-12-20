import { useState } from 'react';
import Modal from '../App/Modal'; // Import Modal component

export default function AddSoftware () {
    const [name, setName] = useState('');
    const [version, setVersion] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [modalContent, setModalContent] = useState(''); // Content for the modal

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            name: name,
            version: version,
            description: description,
            price: price
        }

        try {
            const response = await fetch('http://localhost:3001/api/softwares', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToSend)
            });

            if(!response.ok) throw new Error("Could not add new software to the database");

            // eslint-disable-next-line no-unused-vars
            const result = await response.json();
            setModalContent('Software added successfully');
            setShowModal(true);
        } catch(err) {
            setModalContent(`Error: ${err.message}`);
            setShowModal(true);
        }
    }

    return(
        <div className='centered-content'>
            <h1>Create new software</h1>
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
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
        </div>
    );
}
