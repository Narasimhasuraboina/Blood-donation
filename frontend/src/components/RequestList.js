import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const API = `${API_BASE_URL}/api`;

function RequestList() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [contact, setContact] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // ✅ Fetch active blood requests
    useEffect(() => {
        axios
            .get(`${API}/request/active`)
            .then(res => setRequests(res.data))
            .catch(err => console.error(err));
    }, []);

    // ✅ Click on request
    const handleClick = (request) => {
        if (!token) {
            navigate('/auth');
            return;
        }
        setSelectedRequest(request);
    };

    // ✅ Get contact details
    const handleYes = async () => {
        try {
            const res = await axios.get(
                `${API}/request/${selectedRequest.request_id}/contact`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setContact(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Access denied');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Blood Requests</h2>

            {requests.map(req => (
                <div
                    key={req.request_id}
                    onClick={() => handleClick(req)}
                    style={{
                        padding: '15px',
                        margin: '10px 0',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <strong>{req.requested_blood_type}</strong>
                    {' | '}
                    {req.hospital_name}
                    {' | '}
                    Urgency: {req.urgency_level}
                </div>
            ))}

            {selectedRequest && !contact && (
                <div style={modal}>
                    <p>
                        You have blood type <b>{selectedRequest.requested_blood_type}</b>
                        <br />
                        Do you want to donate?
                    </p>
                    <button onClick={handleYes}>YES</button>
                    <button onClick={() => setSelectedRequest(null)}>NO</button>
                </div>
            )}

            {contact && (
                <div style={modal}>
                    <h3>Contact Details</h3>
                    <p><b>Hospital:</b> {contact.hospital_name}</p>
                    <p><b>Contact:</b> {contact.contact_person}</p>
                    <button onClick={() => {
                        setSelectedRequest(null);
                        setContact(null);
                    }}>
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

const modal = {
    position: 'fixed',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    zIndex: 1000
};

export default RequestList;
