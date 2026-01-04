import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Calendar,
    Scale,
    Ruler,
    Activity,
    Target,
    Camera,
    Edit2,
    Save,
    X,
    Award,
    Flame,
    Dumbbell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressRing } from '../components/ui';
import { calculateBMI, getBMICategory, calculateBMR, calculateTDEE } from '../utils';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    const { user, userProfile, streak, progress, updateProfile: updateUserProfile } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<{
        displayName: string;
        weight: number;
        height: number;
        age: number;
        activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    }>({
        displayName: userProfile?.displayName || '',
        weight: userProfile?.weight || 0,
        height: userProfile?.height || 0,
        age: userProfile?.age || 0,
        activityLevel: userProfile?.activityLevel || 'moderate',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUserProfile({
                displayName: editData.displayName,
                weight: editData.weight,
                height: editData.height,
                age: editData.age,
                activityLevel: editData.activityLevel as any,
            });
            toast.success('Profile updated!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate metrics
    const bmi = userProfile ? calculateBMI(userProfile.weight, userProfile.height) : 0;
    const bmiInfo = getBMICategory(bmi);
    const bmr = userProfile ? calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender as 'male' | 'female') : 0;
    const tdee = userProfile ? calculateTDEE(bmr, userProfile.activityLevel) : 0;

    const xpProgress = progress.xpToNextLevel > 0
        ? (progress.currentXP / progress.xpToNextLevel) * 100
        : 0;

    return (
        <div className="profile-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>My Profile</h1>
                    <p>Manage your account and settings</p>
                </div>
            </header>

            <div className="profile-grid">
                {/* Profile Card */}
                <Card className="profile-card">
                    <CardContent>
                        <div className="profile-header">
                            <div className="avatar-container">
                                {userProfile?.photoURL ? (
                                    <img src={userProfile.photoURL} alt="Profile" className="avatar" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {userProfile?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <button className="avatar-edit">
                                    <Camera size={16} />
                                </button>
                            </div>

                            <div className="profile-info">
                                <h2>{userProfile?.displayName || 'User'}</h2>
                                <p>{user?.email}</p>
                                <div className="profile-badges">
                                    <span className="badge level">Level {progress.level}</span>
                                    <span className="badge streak">🔥 {streak.current} day streak</span>
                                </div>
                            </div>

                            {!isEditing ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    leftIcon={<Edit2 size={16} />}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            ) : (
                                <div className="edit-actions">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        <X size={16} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        leftIcon={<Save size={16} />}
                                        onClick={handleSave}
                                        isLoading={isSaving}
                                    >
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* XP Progress */}
                        <div className="xp-section">
                            <div className="xp-header">
                                <span>Level {progress.level}</span>
                                <span>{progress.currentXP} / {progress.xpToNextLevel} XP</span>
                            </div>
                            <div className="xp-bar">
                                <motion.div
                                    className="xp-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xpProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="profile-details">
                            {isEditing ? (
                                <div className="edit-form">
                                    <div className="form-row">
                                        <label>
                                            <User size={16} />
                                            <span>Display Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.displayName}
                                            onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <label>
                                            <Scale size={16} />
                                            <span>Weight (kg)</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={editData.weight}
                                            onChange={(e) => setEditData({ ...editData, weight: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <label>
                                            <Ruler size={16} />
                                            <span>Height (cm)</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={editData.height}
                                            onChange={(e) => setEditData({ ...editData, height: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <label>
                                            <Calendar size={16} />
                                            <span>Age</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={editData.age}
                                            onChange={(e) => setEditData({ ...editData, age: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <label>
                                            <Activity size={16} />
                                            <span>Activity Level</span>
                                        </label>
                                        <select
                                            value={editData.activityLevel}
                                            onChange={(e) => setEditData({ ...editData, activityLevel: e.target.value as typeof editData.activityLevel })}
                                        >
                                            <option value="sedentary">Sedentary</option>
                                            <option value="light">Lightly Active</option>
                                            <option value="moderate">Moderately Active</option>
                                            <option value="active">Very Active</option>
                                            <option value="very_active">Extremely Active</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <Scale size={18} />
                                        <span className="detail-value">{userProfile?.weight || '-'} kg</span>
                                        <span className="detail-label">Weight</span>
                                    </div>
                                    <div className="detail-item">
                                        <Ruler size={18} />
                                        <span className="detail-value">{userProfile?.height || '-'} cm</span>
                                        <span className="detail-label">Height</span>
                                    </div>
                                    <div className="detail-item">
                                        <Calendar size={18} />
                                        <span className="detail-value">{userProfile?.age || '-'}</span>
                                        <span className="detail-label">Age</span>
                                    </div>
                                    <div className="detail-item">
                                        <Activity size={18} />
                                        <span className="detail-value capitalize">{userProfile?.activityLevel?.replace('_', ' ') || '-'}</span>
                                        <span className="detail-label">Activity</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Body Metrics */}
                <Card className="metrics-card">
                    <CardHeader>
                        <CardTitle>Body Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="metrics-grid">
                            <div className="metric-item">
                                <div className="metric-ring">
                                    <ProgressRing
                                        progress={Math.min(100, (bmi / 40) * 100)}
                                        size={80}
                                        strokeWidth={6}
                                        color={bmiInfo.color}
                                    >
                                        <span className="metric-value">{bmi.toFixed(1)}</span>
                                    </ProgressRing>
                                </div>
                                <div className="metric-info">
                                    <span className="metric-label">BMI</span>
                                    <span className="metric-status" style={{ color: bmiInfo.color }}>{bmiInfo.category}</span>
                                </div>
                            </div>

                            <div className="metric-item">
                                <div className="metric-icon bmr">
                                    <Flame size={28} />
                                </div>
                                <div className="metric-info">
                                    <span className="metric-value">{Math.round(bmr)}</span>
                                    <span className="metric-label">BMR (cal/day)</span>
                                </div>
                            </div>

                            <div className="metric-item">
                                <div className="metric-icon tdee">
                                    <Activity size={28} />
                                </div>
                                <div className="metric-info">
                                    <span className="metric-value">{Math.round(tdee)}</span>
                                    <span className="metric-label">TDEE (cal/day)</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Summary */}
                <Card className="stats-card">
                    <CardHeader>
                        <CardTitle>All-Time Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="stats-list">
                            <div className="stat-row">
                                <div className="stat-icon">
                                    <Dumbbell size={20} />
                                </div>
                                <span className="stat-label">Total Workouts</span>
                                <span className="stat-value">{progress.totalXP > 0 ? Math.floor(progress.totalXP / 50) : 0}</span>
                            </div>
                            <div className="stat-row">
                                <div className="stat-icon">
                                    <Flame size={20} />
                                </div>
                                <span className="stat-label">Current Streak</span>
                                <span className="stat-value">{streak.current} days</span>
                            </div>
                            <div className="stat-row">
                                <div className="stat-icon">
                                    <Award size={20} />
                                </div>
                                <span className="stat-label">Longest Streak</span>
                                <span className="stat-value">{streak.longest} days</span>
                            </div>
                            <div className="stat-row">
                                <div className="stat-icon">
                                    <Target size={20} />
                                </div>
                                <span className="stat-label">Total XP</span>
                                <span className="stat-value">{progress.totalXP}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
