// ==========================================
// Connected Apps Component
// ==========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Check, X, ExternalLink } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { db } from '../../firebase';
import { useUser } from '../../contexts/UserContext';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import {
    initiateStravaAuth,
    getStravaConnectionStatus,
    disconnectStrava,
    fetchStravaActivities,
    convertStravaActivityToWorkout,
    updateLastSyncTime,
} from '../../services/stravaService';
import './ConnectedApps.css';

interface AppConnection {
    id: string;
    name: string;
    icon: string;
    color: string;
    connected: boolean;
    athleteName?: string;
    lastSync?: Date;
    onConnect: () => void;
    onDisconnect: () => void;
    onSync?: () => void;
}

const ConnectedApps: React.FC = () => {
    const { user } = useUser();
    const [stravaStatus, setStravaStatus] = useState({
        connected: false,
        athleteName: '',
        lastSync: undefined as Date | undefined,
    });
    const [isSyncing, setIsSyncing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check Strava connection status on mount
    useEffect(() => {
        const checkStatus = async () => {
            if (!user) return;
            try {
                const status = await getStravaConnectionStatus(user.uid);
                setStravaStatus({
                    connected: status.connected,
                    athleteName: status.athleteName || '',
                    lastSync: status.lastSync,
                });
            } catch (error) {
                console.error('Error checking Strava status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();
    }, [user]);

    // Handle Strava connect
    const handleStravaConnect = () => {
        initiateStravaAuth();
    };

    // Handle Strava disconnect
    const handleStravaDisconnect = async () => {
        if (!user) return;
        try {
            await disconnectStrava(user.uid);
            setStravaStatus({ connected: false, athleteName: '', lastSync: undefined });
            toast.success('Disconnected from Strava');
        } catch (error) {
            toast.error('Failed to disconnect');
        }
    };

    // Handle Strava sync
    const handleStravaSync = async () => {
        if (!user) return;
        setIsSyncing(true);

        try {
            const activities = await fetchStravaActivities(user.uid, 10);
            let importedCount = 0;

            for (const activity of activities) {
                const workout = convertStravaActivityToWorkout(activity, user.uid);
                await addDoc(collection(db, 'workouts'), {
                    ...workout,
                    createdAt: new Date(),
                    source: 'strava',
                    stravaId: activity.id,
                });
                importedCount++;
            }

            await updateLastSyncTime(user.uid);
            setStravaStatus(prev => ({ ...prev, lastSync: new Date() }));
            toast.success(`Imported ${importedCount} activities from Strava!`);
        } catch (error) {
            console.error('Sync error:', error);
            toast.error('Failed to sync activities');
        } finally {
            setIsSyncing(false);
        }
    };

    const apps: AppConnection[] = [
        {
            id: 'strava',
            name: 'Strava',
            icon: '🏃',
            color: '#FC4C02',
            connected: stravaStatus.connected,
            athleteName: stravaStatus.athleteName,
            lastSync: stravaStatus.lastSync,
            onConnect: handleStravaConnect,
            onDisconnect: handleStravaDisconnect,
            onSync: handleStravaSync,
        },
        // Future integrations can be added here
        {
            id: 'fitbit',
            name: 'Fitbit',
            icon: '⌚',
            color: '#00B0B9',
            connected: false,
            onConnect: () => toast('Fitbit integration coming soon!'),
            onDisconnect: () => { },
        },
        {
            id: 'garmin',
            name: 'Garmin',
            icon: '📍',
            color: '#000000',
            connected: false,
            onConnect: () => toast('Garmin integration coming soon!'),
            onDisconnect: () => { },
        },
    ];

    const formatLastSync = (date?: Date) => {
        if (!date) return 'Never';
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    if (isLoading) {
        return (
            <Card className="connected-apps-card">
                <CardHeader>
                    <CardTitle>Connected Apps</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="loading-placeholder">Loading...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="connected-apps-card">
            <CardHeader>
                <CardTitle>Connected Apps</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="connected-apps-description">
                    Connect your fitness apps to automatically sync your activities
                </p>

                <div className="apps-list">
                    {apps.map((app, index) => (
                        <motion.div
                            key={app.id}
                            className={`app-item ${app.connected ? 'connected' : ''}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="app-icon\" style={{ backgroundColor: `${app.color}20` }}>
                                <span>{app.icon}</span>
                            </div>

                            <div className="app-info">
                                <div className="app-header">
                                    <span className="app-name">{app.name}</span>
                                    {app.connected && (
                                        <span className="connection-status">
                                            <Check size={14} /> Connected
                                        </span>
                                    )}
                                </div>
                                {app.connected ? (
                                    <span className="app-details">
                                        {app.athleteName && `${app.athleteName} • `}
                                        Last sync: {formatLastSync(app.lastSync)}
                                    </span>
                                ) : (
                                    <span className="app-details">Not connected</span>
                                )}
                            </div>

                            <div className="app-actions">
                                {app.connected ? (
                                    <>
                                        {app.onSync && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={app.onSync}
                                                disabled={isSyncing}
                                                leftIcon={<RefreshCw size={14} className={isSyncing ? 'spinning' : ''} />}
                                            >
                                                {isSyncing ? 'Syncing...' : 'Sync'}
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={app.onDisconnect}
                                        >
                                            <X size={14} />
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={app.onConnect}
                                        rightIcon={<ExternalLink size={14} />}
                                    >
                                        Connect
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ConnectedApps;
