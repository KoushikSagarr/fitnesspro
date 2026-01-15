import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProvider, useUser } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/layout';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import ExercisesPage from './pages/ExercisesPage';
import GoalsPage from './pages/GoalsPage';
import ProgressPage from './pages/ProgressPage';
import NutritionPage from './pages/NutritionPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import OnboardingPage from './pages/OnboardingPage';
import StravaCallback from './pages/StravaCallback';

import './App.css';

// Main App Content (inside providers)
const AppContent: React.FC = () => {
  const { user, isLoading, isProfileComplete } = useUser();
  const [currentPath, setCurrentPath] = useState(() => {
    // Check if we're on the Strava callback URL
    if (window.location.pathname === '/strava/callback') {
      return '/strava/callback';
    }
    return '/dashboard';
  });

  // Listen for URL changes (for OAuth callbacks)
  useEffect(() => {
    if (window.location.pathname === '/strava/callback') {
      setCurrentPath('/strava/callback');
    }
  }, []);

  // Show loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-content"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-logo">💪</div>
          <div className="loading-spinner-container">
            <div className="loading-spinner" />
          </div>
          <p className="loading-text">Loading FitTrack Pro...</p>
        </motion.div>
      </div>
    );
  }

  // Not logged in - show auth page
  if (!user) {
    return <AuthPage />;
  }

  // Logged in but no profile - show onboarding
  if (!isProfileComplete) {
    return <OnboardingPage />;
  }

  // Render current page based on path
  const renderPage = () => {
    // Handle Strava callback separately (no sidebar needed)
    if (currentPath === '/strava/callback') {
      return (
        <StravaCallback
          onComplete={() => {
            // Clear the URL and navigate to settings
            window.history.replaceState({}, '', '/');
            setCurrentPath('/settings');
          }}
        />
      );
    }

    switch (currentPath) {
      case '/dashboard':
        return <DashboardPage />;
      case '/workouts':
        return <WorkoutsPage />;
      case '/exercises':
        return <ExercisesPage />;
      case '/goals':
        return <GoalsPage />;
      case '/progress':
        return <ProgressPage />;
      case '/nutrition':
        return <NutritionPage />;
      case '/achievements':
        return <AchievementsPage />;
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  // Logged in with complete profile - show main app
  return (
    <div className="app-layout">
      <Sidebar currentPath={currentPath} onNavigate={setCurrentPath} />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="page-container"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Root App Component with Providers
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <div className="app-wrapper">
          {/* Background Animation */}
          <div className="background-animation">
            <div className="gradient-orb orb-1" />
            <div className="gradient-orb orb-2" />
            <div className="gradient-orb orb-3" />
          </div>

          <AppContent />

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--background-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--divider)',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: 'white',
                },
              },
            }}
          />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
