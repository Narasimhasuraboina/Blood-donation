// frontend/src/components/AuthPage.js
import React, { useState } from 'react';
import Login from './Login';
import Registration from './Registration';

function AuthPage({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true); 

    const handleSwitch = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div style={styles.container}>
            <div style={styles.authBox}>
                <div style={styles.header}>
                    <h2 
                        onClick={() => setIsLogin(true)} 
                        style={isLogin ? styles.activeTab : styles.tab}
                    >
                        🔑 Log In
                    </h2>
                    <h2 
                        onClick={() => setIsLogin(false)} 
                        style={!isLogin ? styles.activeTab : styles.tab}
                    >
                        📝 Register
                    </h2>
                </div>

                {isLogin ? (
                    <Login onLoginSuccess={onAuthSuccess} />
                ) : (
                    <Registration onRegistrationSuccess={handleSwitch} /> 
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh', 
        padding: '20px',
    },
    authBox: {
        width: '100%',
        maxWidth: '400px', 
        padding: '40px', 
        backgroundColor: 'var(--color-card-bg)', 
        borderRadius: '10px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)', 
        transition: 'background-color 0.3s',
    },
    header: {
        display: 'flex',
        marginBottom: '30px', 
        borderBottom: '1px solid var(--color-border)'
    },
    tab: {
        flex: 1,
        textAlign: 'center',
        padding: '10px 0',
        cursor: 'pointer',
        fontSize: '1.2em',
        color: 'var(--color-tab-inactive)',
        margin: 0
    },
    activeTab: {
        flex: 1,
        textAlign: 'center',
        padding: '10px 0',
        cursor: 'default',
        fontSize: '1.2em',
        color: 'var(--color-primary)', 
        borderBottom: '3px solid var(--color-primary)',
        margin: 0
    }
};

export default AuthPage;