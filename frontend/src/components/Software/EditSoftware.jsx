import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Modal from '../App/Modal'; // Import Modal

export default function EditSoftware() {
    const { _id } = useParams();
    const location = useLocation();
    const software = location.state?.software || {};
    const { name, version, description, price } = software;
    const [softwareName, setSoftwareName] = useState(name);
    const [softwareVersion, setSoftwareVersion] = useState(version);
    const [softwareDescription, setSoftwareDescription] = useState(description);
    const [softwarePrice, setSoftwarePrice] = useState(price);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [modalContent, setModalContent] = useState(''); // Content for the modal


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
    
            // eslint-disable-next-line no-unused-vars
            const result = await response.json();
            setModalContent('Software edited successfully');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                // Your redirect logic
            }, 3000); // Close modal and redirect after 3 seconds
        } catch (err) {
            setModalContent(`Error: ${err.message}`);
            setShowModal(true);
        }
    }
    return (
       <div className='centered-content'>
         <h1>Edit software - {name}</h1>
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
            <Modal show={showModal} onClose={() => setShowModal(false)}>
            <p>{modalContent}</p>
         </Modal>
       </div>
    );
}