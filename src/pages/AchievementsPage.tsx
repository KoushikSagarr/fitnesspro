import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Flame,
    Dumbbell,
    Target,
    Crown,
    Zap,
    Star,
    Medal,
    Award,
    Lock
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent, ProgressRing } from '../components/ui';
import './AchievementsPage.css';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    requirement: number;
    type: 'workouts' | 'streak' | 'calories' | 'level';
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const achievements: Achievement[] = [
    // Workout achievements
    { id: 'first_workout', title: 'First Steps', description: 'Complete your first workout', icon: Dumbbell, color: '#CD7F32', requirement: 1, type: 'workouts', tier: 'bronze' },
    { id: 'workout_10', title: 'Getting Started', description: 'Complete 10 workouts', icon: Dumbbell, color: '#CD7F32', requirement: 10, type: 'workouts', tier: 'bronze' },
    { id: 'workout_25', title: 'Committed', description: 'Complete 25 workouts', icon: Dumbbell, color: '#C0C0C0', requirement: 25, type: 'workouts', tier: 'silver' },
    { id: 'workout_50', title: 'Dedicated', description: 'Complete 50 workouts', icon: Dumbbell, color: '#FFD700', requirement: 50, type: 'workouts', tier: 'gold' },
    { id: 'workout_100', title: 'Fitness Master', description: 'Complete 100 workouts', icon: Crown, color: '#E5E4E2', requirement: 100, type: 'workouts', tier: 'platinum' },

    // Streak achievements
    { id: 'streak_3', title: 'On Fire', description: 'Maintain a 3-day streak', icon: Flame, color: '#CD7F32', requirement: 3, type: 'streak', tier: 'bronze' },
    { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Flame, color: '#C0C0C0', requirement: 7, type: 'streak', tier: 'silver' },
    { id: 'streak_30', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: Flame, color: '#FFD700', requirement: 30, type: 'streak', tier: 'gold' },
    { id: 'streak_100', title: 'Unstoppable', description: 'Maintain a 100-day streak', icon: Zap, color: '#E5E4E2', requirement: 100, type: 'streak', tier: 'platinum' },

    // Calorie achievements
    { id: 'calories_1000', title: 'Calorie Burner', description: 'Burn 1,000 calories total', icon: Target, color: '#CD7F32', requirement: 1000, type: 'calories', tier: 'bronze' },
    { id: 'calories_5000', title: 'Fat Destroyer', description: 'Burn 5,000 calories total', icon: Target, color: '#C0C0C0', requirement: 5000, type: 'calories', tier: 'silver' },
    { id: 'calories_10000', title: 'Calorie Crusher', description: 'Burn 10,000 calories total', icon: Target, color: '#FFD700', requirement: 10000, type: 'calories', tier: 'gold' },

    // Level achievements  
    { id: 'level_5', title: 'Rising Star', description: 'Reach Level 5', icon: Star, color: '#CD7F32', requirement: 5, type: 'level', tier: 'bronze' },
    { id: 'level_10', title: 'Experienced', description: 'Reach Level 10', icon: Medal, color: '#C0C0C0', requirement: 10, type: 'level', tier: 'silver' },
    { id: 'level_25', title: 'Elite Athlete', description: 'Reach Level 25', icon: Trophy, color: '#FFD700', requirement: 25, type: 'level', tier: 'gold' },
    { id: 'level_50', title: 'Legend', description: 'Reach Level 50', icon: Crown, color: '#E5E4E2', requirement: 50, type: 'level', tier: 'platinum' },
];

const AchievementsPage: React.FC = () => {
    const { user, streak, progress } = useUser();
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        totalCalories: 0,
    });

    useEffect(() => {
        if (!user) return;

        const workoutsQuery = query(
            collection(db, 'workouts'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(workoutsQuery, (snapshot) => {
            let totalCals = 0;
            snapshot.forEach((doc) => {
                totalCals += doc.data().calories || 0;
            });
            setStats({
                totalWorkouts: snapshot.size,
                totalCalories: totalCals,
            });
        });

        return () => unsubscribe();
    }, [user]);

    const getProgress = (achievement: Achievement): number => {
        let current = 0;
        switch (achievement.type) {
            case 'workouts':
                current = stats.totalWorkouts;
                break;
            case 'streak':
                current = Math.max(streak.current, streak.longest);
                break;
            case 'calories':
                current = stats.totalCalories;
                break;
            case 'level':
                current = progress.level;
                break;
        }
        return Math.min(100, (current / achievement.requirement) * 100);
    };

    const isUnlocked = (achievement: Achievement): boolean => {
        return getProgress(achievement) >= 100;
    };

    const unlockedCount = achievements.filter(a => isUnlocked(a)).length;

    // Group by tier
    const tiers = ['bronze', 'silver', 'gold', 'platinum'] as const;

    return (
        <div className="achievements-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>Achievements</h1>
                    <p>Track your milestones and earn badges</p>
                </div>
                <div className="achievement-summary">
                    <Trophy size={24} />
                    <span>{unlockedCount} / {achievements.length}</span>
                </div>
            </header>

            {/* Progress Overview */}
            <Card className="overview-card">
                <CardContent>
                    <div className="overview-stats">
                        <div className="overview-item">
                            <ProgressRing
                                progress={(unlockedCount / achievements.length) * 100}
                                size={80}
                                strokeWidth={6}
                                color="#8B5CF6"
                            >
                                <Trophy size={24} />
                            </ProgressRing>
                            <div className="overview-info">
                                <span className="overview-value">{Math.round((unlockedCount / achievements.length) * 100)}%</span>
                                <span className="overview-label">Complete</span>
                            </div>
                        </div>
                        <div className="overview-item">
                            <div className="stat-icon level">
                                <Award size={28} />
                            </div>
                            <div className="overview-info">
                                <span className="overview-value">Level {progress.level}</span>
                                <span className="overview-label">{progress.totalXP} XP</span>
                            </div>
                        </div>
                        <div className="overview-item">
                            <div className="stat-icon streak">
                                <Flame size={28} />
                            </div>
                            <div className="overview-info">
                                <span className="overview-value">{streak.current}</span>
                                <span className="overview-label">Day Streak</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Achievement Tiers */}
            {tiers.map((tier, tierIndex) => {
                const tierAchievements = achievements.filter(a => a.tier === tier);
                const tierUnlocked = tierAchievements.filter(a => isUnlocked(a)).length;

                return (
                    <motion.div
                        key={tier}
                        className="achievement-tier"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: tierIndex * 0.1 }}
                    >
                        <div className="tier-header">
                            <span className={`tier-badge ${tier}`}>
                                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                            </span>
                            <span className="tier-progress">{tierUnlocked} / {tierAchievements.length}</span>
                        </div>

                        <div className="achievements-grid">
                            {tierAchievements.map((achievement) => {
                                const unlocked = isUnlocked(achievement);
                                const prog = getProgress(achievement);

                                return (
                                    <motion.div
                                        key={achievement.id}
                                        className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div
                                            className="achievement-icon"
                                            style={{
                                                background: unlocked ? `${achievement.color}20` : undefined,
                                                color: unlocked ? achievement.color : undefined
                                            }}
                                        >
                                            {unlocked ? (
                                                <achievement.icon size={28} />
                                            ) : (
                                                <Lock size={24} />
                                            )}
                                        </div>
                                        <div className="achievement-info">
                                            <h3>{achievement.title}</h3>
                                            <p>{achievement.description}</p>
                                        </div>
                                        {!unlocked && (
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${prog}%` }}
                                                />
                                            </div>
                                        )}
                                        {unlocked && (
                                            <div className="unlocked-badge">
                                                <Star size={16} fill="currentColor" />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default AchievementsPage;
