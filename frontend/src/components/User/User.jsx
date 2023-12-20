import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './User.css';
import { UserContext } from '../App/UserContext'; 
import Modal from '../App/Modal'; 

export default function User() {
    const { _id } = useParams();
    const [user, setUser] = useState({ email: '', role: '', licenses: [], softwares: [] });
    const { email, role, softwares, licenses } = user || {};
    const navigate = useNavigate();
    const currentUser = useContext(UserContext); 
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [modalContent, setModalContent] = useState(''); // Content for the modal


    useEffect(() => {
        const fetchUserData = async () => {
            if(!_id) {
                console.error("User ID is not defined");
                return;
            }
            try {
                const userData = await fetch(`http://localhost:3001/api/users/${_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!userData.ok) throw new Error("Could not fetch user data");
            const data = await userData.json();
            console.log(data);
            setUser(data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchUserData();
    }, [_id]);
    const handleClick = () => {
        navigate(-1);
    }
    const handleDelete = async (_id) => {
        if(window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`http://localhost:3001/api/users/${_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
    
                if (!response.ok) {
                    setModalContent('Error deleting user: ' + response.error);
                    setShowModal(true);
                    return;
                }
        
                setModalContent('User deleted successfully');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/users');
                }, 3000); // Close modal and redirect after 3 seconds
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };
    const handleEdit = () => {
        navigate(`/users/${_id}/edit`); // Navigate to the EditUser page
    };
    return(
        <div className='centered-content'>
            <h1>User details</h1>
            { user && (
                <ul>
                    <li>
                        <p>{email}</p>
                        <p>{role}</p>
                    </li>
                </ul> 
            )}
            <h1>User License list</h1>
            { licenses && 
                <ul>
                    { 
                        licenses.map((license) => (
                            <li key={license._id}>
                                <Link to={`/softwares/${license.softwareId}/users/${license.userId}/licenses/${license._id}`}>{license.key}</Link>
                            </li>
                        ))
                    }
                </ul>
            }
            <h1>Software list</h1>
            { softwares && 
                <ul>
                    {
                        softwares.map((software) => (
                            <li key={software._id}>
                                <Link to={`/softwares/${software._id}`}>{software.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            }
        {currentUser && currentUser.role === 'admin' &&  (
        <>
            <button onClick={() => handleDelete(_id)}>Delete User</button>
            <button onClick={handleEdit}>Edit User</button>
            <button onClick={handleClick}>Back</button>
        </>
        
        )}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
        </div>
    );
}