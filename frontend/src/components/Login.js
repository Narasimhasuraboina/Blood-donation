// frontend/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
 
import { API_BASE_URL } from "../config";

const API_URL_LOGIN = `${API_BASE_URL}/api/auth/login`;



function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('Logging in...');
        setIsSuccess(false);

        try {
            const response = await axios.post(API_URL_LOGIN, {
                email,
                password,
            });

            // ✅ SAFETY CHECK
            if (!response.data || !response.data.token) {
                throw new Error('Token not received from server');
            }

            // ✅ SAVE TOKEN
            localStorage.setItem('token', response.data.token);

            // ✅ SUCCESS MESSAGE
            setMessage('Welcome back! Login successful.');
            setIsSuccess(true);

            // ✅ REDIRECT AFTER SHORT DELAY
            setTimeout(() => {
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            }, 1500);

        } catch (error) {
            console.error('LOGIN ERROR FULL:', error);

            const backendMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Login failed';

            setMessage(`❌ ${backendMessage}`);
            setIsSuccess(false);
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

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>
                    Login
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: { padding: '10px 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: {
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-input-bg)',
        color: 'var(--color-text)',
    },
    button: {
        padding: '12px',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
    },
    successMessage: {
        color: 'var(--color-success)',
        backgroundColor: 'rgba(39, 174, 96, 0.15)',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
    },
    errorMessage: {
        color: 'var(--color-error)',
        backgroundColor: 'rgba(231, 76, 60, 0.15)',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
    },
};

export default Login;
