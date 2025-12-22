import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import WorkoutHistoryPage from './components/WorkoutHistoryPage';

import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'history'>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error with Google Sign-In:', error);
    }
  };

  const handleNavigate = (page: 'dashboard' | 'history') => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="app-wrapper">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {user ? (
        <div className="app-container fullscreen">
          <Navbar user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
          <div className="dashboard-wrapper">
            {currentPage === 'dashboard' && <Dashboard user={user} />}
            {currentPage === 'history' && <WorkoutHistoryPage />}
          </div>
        </div>
      ) : (
        <div className="auth-page">
          <div className="auth-page-left">
            <div className="logo-section">
              <div className="app-logo">💪</div>
              <h1 className="app-title">Fitness Tracker</h1>
              <p className="app-subtitle">Your personal journey to a healthier, stronger you.</p>
            </div>
          </div>
          <div className="auth-page-right">
            <div className="form-container">
              <div className="form-tabs">
                <button 
                  className={`tab-button ${!showSignUp ? 'active' : ''}`}
                  onClick={() => setShowSignUp(false)}
                >
                  Sign In
                </button>
                <button 
                  className={`tab-button ${showSignUp ? 'active' : ''}`}
                  onClick={() => setShowSignUp(true)}
                >
                  Sign Up
                </button>
              </div>

              <div className="forms-wrapper">
                {showSignUp ? (
                  <div className="form-section active">
                    <SignUp />
                  </div>
                ) : (
                  <div className="form-section active">
                    <SignIn />
                  </div>
                )}
              </div>

              <div className="auth-footer">
                <div className="divider">
                  <span>or continue with</span>
                </div>
                
                <div className="social-login">
                  <button className="social-btn google" onClick={handleGoogleSignIn}>
                    <span className="social-icon">G</span>
                    Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
