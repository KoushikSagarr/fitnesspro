import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Moon,
    Sun,
    Bell,
    Shield,
    LogOut,
    User,
    Globe,
    HelpCircle,
    ChevronRight,
    type LucideIcon
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth } from '../firebase';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent, Button } from '../components/ui';
import { ConnectedApps } from '../components/integrations';
import './SettingsPage.css';

interface ToggleItem {
    icon: LucideIcon;
    label: string;
    description: string;
    action: 'toggle';
    value: boolean;
    onToggle: () => void;
}

interface LinkItem {
    icon: LucideIcon;
    label: string;
    description: string;
    action: 'link';
    onClick: () => void;
}

type SettingItem = ToggleItem | LinkItem;

interface SettingsSection {
    title: string;
    items: SettingItem[];
}

const SettingsPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, userProfile } = useUser();
    const [notifications, setNotifications] = useState(true);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast.success('Signed out successfully');
            // Page will redirect automatically when auth state changes
        } catch (error) {
            toast.error('Failed to sign out');
        }
    };

    const settingsSections: SettingsSection[] = [
        {
            title: 'Appearance',
            items: [
                {
                    icon: theme === 'dark' ? Moon : Sun,
                    label: 'Theme',
                    description: theme === 'dark' ? 'Dark mode' : 'Light mode',
                    action: 'toggle',
                    value: theme === 'dark',
                    onToggle: toggleTheme,
                },
            ],
        },
        {
            title: 'Notifications',
            items: [
                {
                    icon: Bell,
                    label: 'Push Notifications',
                    description: 'Receive workout reminders',
                    action: 'toggle',
                    value: notifications,
                    onToggle: () => setNotifications(!notifications),
                },
            ],
        },
        {
            title: 'Account',
            items: [
                {
                    icon: User,
                    label: 'Edit Profile',
                    description: 'Update your personal information',
                    action: 'link',
                    onClick: () => toast('Use the Profile tab in the sidebar'),
                },
                {
                    icon: Shield,
                    label: 'Privacy & Security',
                    description: 'Manage your data and privacy',
                    action: 'link',
                    onClick: () => toast('Coming soon!'),
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    icon: HelpCircle,
                    label: 'Help Center',
                    description: 'Get help and support',
                    action: 'link',
                    onClick: () => toast('Coming soon!'),
                },
                {
                    icon: Globe,
                    label: 'About FitTrack Pro',
                    description: 'Version 1.0.0',
                    action: 'link',
                    onClick: () => toast('FitTrack Pro v1.0.0 - Built with ❤️'),
                },
            ],
        },
    ];

    return (
        <div className="settings-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>Settings</h1>
                    <p>Customize your experience</p>
                </div>
            </header>

            {/* User Card */}
            <Card className="user-card">
                <CardContent>
                    <div className="user-info">
                        <div className="user-avatar">
                            {userProfile?.photoURL ? (
                                <img src={userProfile.photoURL} alt="Profile" />
                            ) : (
                                <span>{userProfile?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <div className="user-details">
                            <h3>{userProfile?.displayName || 'User'}</h3>
                            <p>{user?.email}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toast('Use the Profile tab in the sidebar')}>
                            Edit
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Connected Apps */}
            <ConnectedApps />

            {/* Settings Sections */}
            <div className="settings-sections">
                {settingsSections.map((section, sectionIndex) => (
                    <motion.div
                        key={section.title}
                        className="settings-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex * 0.1 }}
                    >
                        <h2 className="section-title">{section.title}</h2>
                        <Card className="settings-card">
                            <CardContent>
                                {section.items.map((item) => (
                                    <div
                                        key={item.label}
                                        className={`setting-item ${item.action === 'link' ? 'clickable' : ''}`}
                                        onClick={item.action === 'link' ? item.onClick : undefined}
                                    >
                                        <div className="setting-icon">
                                            <item.icon size={20} />
                                        </div>
                                        <div className="setting-info">
                                            <span className="setting-label">{item.label}</span>
                                            <span className="setting-description">{item.description}</span>
                                        </div>
                                        {item.action === 'toggle' && (
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={item.value}
                                                    onChange={item.onToggle}
                                                />
                                                <span className="toggle-slider" />
                                            </label>
                                        )}
                                        {item.action === 'link' && (
                                            <ChevronRight size={20} className="chevron" />
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Danger Zone */}
            <motion.div
                className="danger-zone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="section-title">Danger Zone</h2>
                <Card className="danger-card">
                    <CardContent>
                        <div className="danger-item">
                            <div className="danger-info">
                                <LogOut size={20} />
                                <div>
                                    <span className="danger-label">Sign Out</span>
                                    <span className="danger-description">Sign out of your account</span>
                                </div>
                            </div>
                            <Button variant="outline" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default SettingsPage;
