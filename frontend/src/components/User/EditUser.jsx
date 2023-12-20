/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditUser.css';
import Modal from '../App/Modal';

export default function EditUser() {
    const { userId } = useParams();
    const [user, setUser] = useState({ email: '', role: '' });
    const navigate = useNavigate();
    const [message, setMessage] = useState(null); // New state for messages
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [modalContent, setModalContent] = useState(''); // Content for the modal

    useEffect(() => {
        // Fetch the current user data
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/api/users`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    id: userId, 
                    email: user.email,
                    role: user.role
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }
    
            console.log('User update successful'); // Log for success
            setModalContent('User edited successfully');
            setShowModal(true);
    
            setTimeout(() => {
                setShowModal(false);
                navigate('/users');
            }, 3000);
        } catch (error) {
            console.log('User update failed', error); // Log for error
            setModalContent(`Error updating user: ${error.message}`);
            setShowModal(true);
        }
    };

    return (
        <div className='centered-content'>
            <h1>Edit User</h1>
            {message && <div className="message">{message}</div>} {/* Display message */}
            <form onSubmit={handleSubmit} className="edit-user-form">
                <div className="form-field">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={user.email} 
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                </div>
                <div className="form-field">
                    <label>Role:</label>
                    <select 
                        value={user.role} 
                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                    >
                        <option value="admin">Admin</option>
                        <option value="premium">Premium</option>
                        <option value="standard">Standard</option>
                    </select>
                </div>

                <button type="submit">Update User</button>
            </form>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
        </div>
    );
}
