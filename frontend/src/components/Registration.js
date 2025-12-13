// frontend/src/components/Registration.js
import React, { useState } from 'react';
import axios from 'axios';

const API_URL_REGISTER = 'http://localhost:5000/api/auth/register'; 

// Accepts onRegistrationSuccess prop for switching to Login tab
function Registration({ onRegistrationSuccess }) {
    // State to hold all form data
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', password: '', 
        blood_type: '', date_of_birth: '', phone_number: '', city: ''
    });

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Registering...'); 
        setIsSuccess(false);

        try {
            const response = await axios.post(API_URL_REGISTER, formData);
            
            // Success response
            setMessage(`Success! ${response.data.message} You can now log in.`);
            setIsSuccess(true);
            
            // Clear form (optional)
            setFormData({
                first_name: '', last_name: '', email: '', password: '', 
                blood_type: '', date_of_birth: '', phone_number: '', city: ''
            });

            // Trigger success callback to switch back to Login tab
            if (onRegistrationSuccess) {
                onRegistrationSuccess();
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed due to server error.';
            setMessage(`Error: ${errorMessage}`);
            setIsSuccess(false);
            console.error('Registration Error:', error);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                {message && (
                    <p style={isSuccess ? styles.successMessage : styles.errorMessage}>
                        {message}
                    </p>
                )}
                
                <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} style={styles.input} />
                <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} style={styles.input} />
                <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required style={styles.input} />
                <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange} required style={styles.input} />
                
                <select name="blood_type" value={formData.blood_type} onChange={handleChange} required style={styles.input}>
                    <option value="">Select Blood Type *</option>
                    {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <input type="date" name="date_of_birth" placeholder="Date of Birth" value={formData.date_of_birth} onChange={handleChange} style={styles.input} />
                <input type="tel" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} style={styles.input} />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} style={styles.input} />

                <button type="submit" style={styles.button}>Register</button>
            </form>
        </div>
    );
}

const styles = {
    container: { padding: '10px 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-input-bg)', color: 'var(--color-text)' },
    button: { padding: '12px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' },
    successMessage: { color: 'var(--color-success)', backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: '10px', borderRadius: '5px' },
    errorMessage: { color: 'var(--color-error)', backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: '10px', borderRadius: '5px' },
};

export default Registration;