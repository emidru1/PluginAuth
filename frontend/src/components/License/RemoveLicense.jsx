import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../App/Modal'; // Import Modal component
import { useState } from 'react';

export default function RemoveLicense() {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [modalContent, setModalContent] = useState(''); // Content for the modal

    const handleClick = async () => {
        if(!_id) {
            console.error("License ID is not defined");
            return;
        }
        if (window.confirm('Are you sure you want to delete this license?')) {
            const toRemove = {
                _id: _id
            }
            console.log(toRemove);
            try {
                // eslint-disable-next-line no-unused-vars
                const response = await fetch('http://localhost:3001/api/licenses', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(toRemove)
            })
            setModalContent('License deleted successfully');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/licenses');
                }, 3000); // Close modal and redirect after 3 seconds
            } catch(err) {
                setModalContent(`Error: ${err.message}`);
                setShowModal(true);
            }

        }
        //Easy way out for message
        window.alert('License has been deleted!');
        navigate('/licenses');  
    }

    return(
        <div>
            <button onClick={handleClick}>Delete</button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
        </div>
    );
}