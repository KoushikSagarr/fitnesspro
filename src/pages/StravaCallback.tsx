// ==========================================
// Strava OAuth Callback Handler
// ==========================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import {
    exchangeCodeForTokens,
    saveStravaTokens,
} from '../services/stravaService';
import { Button } from '../components/ui';
import './StravaCallback.css';

interface CallbackState {
    status: 'loading' | 'success' | 'error';
    message: string;
}

interface StravaCallbackProps {
    onComplete: () => void;
}

const StravaCallback: React.FC<StravaCallbackProps> = ({ onComplete }) => {
    const { user } = useUser();
    const [state, setState] = useState<CallbackState>({
        status: 'loading',
        message: 'Connecting to Strava...',
    });

    useEffect(() => {
        const handleCallback = async () => {
            // Get authorization code from URL
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            if (error) {
                setState({
                    status: 'error',
                    message: 'Authorization was denied or cancelled.',
                });
                return;
            }

            if (!code) {
                setState({
                    status: 'error',
                    message: 'No authorization code received.',
                });
                return;
            }

            if (!user) {
                setState({
                    status: 'error',
                    message: 'You must be logged in to connect Strava.',
                });
                return;
            }

            try {
                // Exchange code for tokens
                setState({ status: 'loading', message: 'Exchanging authorization...' });
                const { tokens, athlete } = await exchangeCodeForTokens(code);

                // Save tokens to Firestore
                setState({ status: 'loading', message: 'Saving connection...' });
                const athleteName = `${athlete.firstname} ${athlete.lastname}`;
                await saveStravaTokens(user.uid, tokens, athleteName);

                setState({
                    status: 'success',
                    message: `Connected as ${athleteName}!`,
                });

                toast.success('Strava connected successfully!');

                // Redirect to settings after a short delay
                setTimeout(() => {
                    onComplete();
                }, 2000);
            } catch (error) {
                console.error('Strava callback error:', error);
                setState({
                    status: 'error',
                    message: 'Failed to connect to Strava. Please try again.',
                });
            }
        };

        handleCallback();
    }, [user, onComplete]);

    return (
        <div className="strava-callback-page">
            <motion.div
                className="callback-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="strava-logo">
                    <span>🏃</span>
                </div>

                {state.status === 'loading' && (
                    <>
                        <motion.div
                            className="status-icon loading"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                            <Loader2 size={32} />
                        </motion.div>
                        <h2>Connecting to Strava</h2>
                        <p>{state.message}</p>
                    </>
                )}

                {state.status === 'success' && (
                    <>
                        <motion.div
                            className="status-icon success"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        >
                            <Check size={32} />
                        </motion.div>
                        <h2>Connected!</h2>
                        <p>{state.message}</p>
                        <p className="redirect-notice">Redirecting to settings...</p>
                    </>
                )}

                {state.status === 'error' && (
                    <>
                        <motion.div
                            className="status-icon error"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <X size={32} />
                        </motion.div>
                        <h2>Connection Failed</h2>
                        <p>{state.message}</p>
                        <Button onClick={onComplete} style={{ marginTop: '1rem' }}>
                            Back to Settings
                        </Button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default StravaCallback;
