import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Dumbbell,
    Target,
    TrendingUp,
    Apple,
    Trophy,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Flame,
    Moon,
    Sun
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Sidebar.css';

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    path: string;
}

const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { id: 'exercises', label: 'Exercises', icon: Flame, path: '/exercises' },
    { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/progress' },
    { id: 'nutrition', label: 'Nutrition', icon: Apple, path: '/nutrition' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, path: '/achievements' },
];

const bottomNavItems: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

interface SidebarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
    const { userProfile, streak, progress, logout } = useUser();
    const { theme, toggleTheme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleNavClick = (path: string) => {
        onNavigate(path);
        setIsMobileOpen(false);
    };

    const renderNavItem = (item: NavItem) => {
        const isActive = currentPath === item.path;
        const Icon = item.icon;

        return (
            <motion.button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="nav-icon">
                    <Icon size={20} />
                </span>
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.span
                            className="nav-label"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                        >
                            {item.label}
                        </motion.span>
                    )}
                </AnimatePresence>
                {isActive && (
                    <motion.div
                        className="nav-indicator"
                        layoutId="nav-indicator"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                )}
            </motion.button>
        );
    };

    const sidebarContent = (
        <>
            {/* Logo Section */}
            <div className="sidebar-header">
                <div className="logo-container">
                    <span className="logo-icon">💪</span>
                    {!isCollapsed && (
                        <motion.div
                            className="logo-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <span className="logo-title">FitTrack</span>
                            <span className="logo-subtitle">Pro</span>
                        </motion.div>
                    )}
                </div>
                <button
                    className="collapse-btn desktop-only"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <Menu size={18} />
                </button>
            </div>

            {/* User Quick Stats */}
            {!isCollapsed && userProfile && (
                <motion.div
                    className="user-stats-card"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="user-avatar">
                        {userProfile.photoURL ? (
                            <img src={userProfile.photoURL} alt="User" />
                        ) : (
                            <span>{userProfile.displayName?.[0] || userProfile.email[0].toUpperCase()}</span>
                        )}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{userProfile.displayName || 'User'}</span>
                        <span className="user-level">Level {progress.level}</span>
                    </div>
                    <div className="streak-badge">
                        <Flame size={14} />
                        <span>{streak.current}</span>
                    </div>
                </motion.div>
            )}

            {/* Main Navigation */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-section-title">{!isCollapsed && 'Main Menu'}</span>
                    {mainNavItems.map(renderNavItem)}
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="sidebar-footer">
                <div className="nav-section">
                    {bottomNavItems.map(renderNavItem)}
                </div>

                {/* Theme Toggle */}
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>

                {/* Logout Button */}
                <button className="logout-btn" onClick={logout}>
                    <LogOut size={18} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <header className="mobile-header">
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileOpen(true)}
                >
                    <Menu size={24} />
                </button>
                <div className="mobile-logo">
                    <span className="logo-icon">💪</span>
                    <span className="logo-title">FitTrack</span>
                </div>
                <div className="mobile-streak">
                    <Flame size={16} />
                    <span>{streak.current}</span>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <motion.aside
                className={`sidebar desktop-sidebar ${isCollapsed ? 'collapsed' : ''}`}
                animate={{ width: isCollapsed ? 80 : 260 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            className="sidebar-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside
                            className="sidebar mobile-sidebar"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <button
                                className="mobile-close-btn"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <X size={24} />
                            </button>
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
