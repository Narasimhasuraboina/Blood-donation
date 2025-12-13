// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import DashboardPage from './pages/DashboardPage';
import RequestList from './components/RequestList'; 
 


import './App.css'; 

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true' || false; 
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    const handleAuthSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <Router>
            <div className="App">
                <header style={styles.header}>
                    <div style={styles.headerContent}>
                        <h1 style={styles.title}>Blood Donation Portal</h1>
                        <nav style={styles.nav}>
                            {isLoggedIn ? (
                                <>
                                    <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
                                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                                </>
                            ) : (
                                <Link to="/auth" style={styles.navLink}>Login/Register</Link>
                            )}
                            <button onClick={toggleDarkMode} style={styles.modeToggle}>
                                {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                            </button>
                        </nav>
                    </div>
                </header>

                <main>
                    <Routes>
                        {/* Homepage: Redirects to Auth/Dashboard */}
                        <Route 
                            path="/" 
                            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />} 
                        />
                        
                        {/* Authentication Route: Shows Login/Register and Public Requests */}
                        <Route 
                            path="/auth" 
                            element={isLoggedIn ? <Navigate to="/dashboard" /> : (
                                <>
                                    <RequestList />
                                    <AuthPage onAuthSuccess={handleAuthSuccess} />
                                </>
                            )} 
                        />

                        {/* Protected Dashboard Route */}
                        <Route 
                            path="/dashboard" 
                            element={isLoggedIn ? <DashboardPage onLogout={handleLogout} /> : <Navigate to="/auth" />} 
                        />
                        
                        {/* Fallback/404 */}
                        <Route 
                            path="*" 
                            element={<p style={{textAlign: 'center', marginTop: '100px', color: 'var(--color-text)'}}>404 - Page Not Found</p>} 
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

const styles = {
    header: {
        backgroundColor: 'var(--color-card-bg)', 
        color: 'var(--color-text)',
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 0',
        transition: 'background-color 0.3s, color 0.3s',
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        margin: 0,
        fontSize: '1.8em',
        color: 'var(--color-primary)'
    },
    nav: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
    },
    navLink: {
        color: 'var(--color-text)',
        textDecoration: 'none',
        fontSize: '1em',
        padding: '5px 10px',
        borderRadius: '5px',
        transition: 'color 0.3s, background-color 0.3s'
    },
    logoutButton: {
        backgroundColor: 'var(--color-error)',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
    },
    modeToggle: {
        backgroundColor: 'var(--color-input-bg)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
    }
}

export default App;