import { useNavigate, useParams } from 'react-router-dom';

export default function RemoveLicense() {
    const { _id } = useParams();
    const navigate = useNavigate();

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
                const response = await fetch('http://localhost:3001/api/licenses', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(toRemove)
            })
            if(!response.ok) throw new Error("Could not remove license entry from the database");
            const result = await response.json();
            console.log(result);
            } catch(err) {
                console.log(err);
            }

        }
        //Easy way out for message
        window.alert('License has been deleted!');
        navigate('/licenses');  
    }

    return(
        <button onClick={handleClick}>Delete</button>
    );
}