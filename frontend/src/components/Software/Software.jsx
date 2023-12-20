import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import  './Software.css';
import { UserContext } from '../App/UserContext';
import { useContext } from 'react';
import Modal from '../App/Modal'; 


export default function Software() {
    const { _id } = useParams();
    const [software, setSoftware] = useState(null);
    const { name, version, description, price } = software || {};
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [modalContent, setModalContent] = useState(''); // Content for the modal

    useEffect(() => {
        const fetchSoftwareData = async () => {
            if(!_id) {
                console.error("Software ID is not defined.");
                return;
            }
            try {
                const softwareData = await fetch(`http://localhost:3001/api/softwares/${_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(!softwareData.ok) throw new Error("Error fetching software data");
                const data = await softwareData.json();
                setSoftware(data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchSoftwareData();
    },[_id]);
    const handleClick = () => {
        navigate(-1);
        
    };
    const handleEditClick = () => {
        navigate(`/softwares/edit/${software._id}`, { state: { software }});
    }
    const handleDelete = async () => {
        if(window.confirm("Are you sure you want to delete this software?")) {
            try {
                const response = await fetch(`http://localhost:3001/api/softwares/${_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete software');
                }
    
                setModalContent('Software deleted successfully');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/softwares');
                }, 3000); // Close modal and redirect after 3 seconds
            } catch (error) {
                setModalContent(`Error deleting software: ${error.message}`);
                setShowModal(true);
            }
        }
    };
    return (
        <div className='centered-content'>
            <h1>Software Details</h1>
            {software && (
                <ul>
                    <li>
                        <p>Name: {name}</p>
                        <p>Version: {version}</p>
                        <p>Description: {description}</p>
                        <p>Price: ${price}</p>
                    </li>
                </ul>
            )}
            <button onClick={handleClick}>Back</button>
            {/* Admin Role Links */}
            {user && user.role === 'admin' && (
            <>
                <button onClick={() => handleEditClick(software)}>Edit</button>
                <button onClick={handleDelete}>Delete Software</button>
            </>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
        </div>
    );
}