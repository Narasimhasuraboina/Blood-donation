// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import AuthPage from './components/AuthPage';
import DashboardPage from './pages/DashboardPage';
import RequestList from './components/RequestList';
import BloodRequest from './components/BloodRequest';

import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true' || false;
    });

    // Always start logged out
    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

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

    return (
        <Router>
            <div className="App">
                {/* HEADER */}
                <header style={styles.header}>
                    <div style={styles.headerContent}>
                        <h1 style={styles.title}>Blood Donation Portal</h1>

                        <nav style={styles.nav}>
                            {/* 🔴 REQUEST BLOOD ALWAYS VISIBLE */}
                            <Link to="/request" style={styles.navLink}>
                                🩸 Request Blood
                            </Link>

                            {isLoggedIn && (
                                <>
                                    <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
                                    <button onClick={handleLogout} style={styles.logoutButton}>
                                        Logout
                                    </button>
                                </>
                            )}

                            <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.modeToggle}>
                                {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                            </button>
                        </nav>
                    </div>
                </header>

                {/* ROUTES */}
                <main>
                    <Routes>
                        {/* ALWAYS START AT LOGIN */}
                        <Route path="/" element={<Navigate to="/auth" />} />

                        {/* LOGIN / REGISTER */}
                        <Route
                            path="/auth"
                            element={
                                isLoggedIn
                                    ? <Navigate to="/dashboard" />
                                    : (
                                        <>
                                            <RequestList />
                                            <AuthPage onAuthSuccess={handleAuthSuccess} />
                                        </>
                                    )
                            }
                        />

                        {/* REQUEST BLOOD (PUBLIC) */}
                        <Route
                            path="/request"
                            element={<BloodRequest />}
                        />

                        {/* DASHBOARD (PROTECTED) */}
                        <Route
                            path="/dashboard"
                            element={
                                isLoggedIn
                                    ? <DashboardPage />
                                    : <Navigate to="/auth" />
                            }
                        />

                        {/* 404 */}
                        <Route
                            path="*"
                            element={<p style={{ textAlign: 'center', marginTop: '100px' }}>404 - Page Not Found</p>}
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
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 0',
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
        color: 'var(--color-primary)',
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
    },
    logoutButton: {
        backgroundColor: 'var(--color-error)',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    modeToggle: {
        backgroundColor: 'var(--color-input-bg)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default App;
