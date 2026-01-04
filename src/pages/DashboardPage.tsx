import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Flame,
    Footprints,
    Timer,
    Dumbbell,
    TrendingUp,
    Target,
    Plus,
    ChevronRight,
    Zap,
    Award
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import { Card, CardHeader, CardTitle, CardContent, ProgressRing, Button } from '../components/ui';
import { WorkoutModal } from '../components/workout';
import { formatNumber, formatDuration, getWorkoutTypeIcon, calculateBMI, getBMICategory, calculateBMR, calculateTDEE } from '../utils';
import './DashboardPage.css';

// Motivational quotes
const quotes = [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Khloe Kardashian" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
    { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
];

const DashboardPage: React.FC = () => {
    const { user, userProfile, streak, progress } = useUser();
    const [todayStats, setTodayStats] = useState({
        calories: 0,
        workouts: 0,
        minutes: 0,
        steps: 0,
    });
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
    const [dailyQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

    // Calculate user metrics
    const bmi = userProfile ? calculateBMI(userProfile.weight, userProfile.height) : 0;
    const bmiInfo = getBMICategory(bmi);
    const bmr = userProfile ? calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender as 'male' | 'female') : 0;
    const tdee = userProfile ? calculateTDEE(bmr, userProfile.activityLevel) : 0;

    // Daily goals (can be customized later)
    const dailyGoals = {
        calories: 500,
        steps: 10000,
        workouts: 1,
        minutes: 30,
    };

    useEffect(() => {
        if (!user) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Listen to today's workouts
        const todayQuery = query(
            collection(db, 'workouts'),
            where('userId', '==', user.uid),
            where('date', '>=', today)
        );

        const unsubToday = onSnapshot(todayQuery, (snapshot) => {
            let calories = 0;
            let minutes = 0;
            let steps = 0;

            snapshot.forEach((doc) => {
                const data = doc.data();
                calories += data.calories || 0;
                minutes += data.duration || 0;
                steps += data.steps || 0;
            });

            setTodayStats({
                calories,
                workouts: snapshot.size,
                minutes,
                steps,
            });
        });

        // Get recent workouts
        const recentQuery = query(
            collection(db, 'workouts'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc'),
            limit(5)
        );

        const unsubRecent = onSnapshot(recentQuery, (snapshot) => {
            const workouts: any[] = [];
            snapshot.forEach((doc) => {
                workouts.push({ id: doc.id, ...doc.data() });
            });
            setRecentWorkouts(workouts);
        });

        // Generate mock weekly data for chart (in production, aggregate from real data)
        const generateWeeklyData = () => {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return days.map((day) => ({
                day,
                calories: Math.floor(Math.random() * 400 + 100),
                minutes: Math.floor(Math.random() * 60 + 10),
            }));
        };
        setWeeklyData(generateWeeklyData());

        return () => {
            unsubToday();
            unsubRecent();
        };
    }, [user]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="dashboard-page">
            {/* Header Section */}
            <header className="dashboard-header">
                <div className="header-content">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="greeting">
                            {getGreeting()}, <span className="user-name">{userProfile?.displayName || 'Champion'}</span>! 👋
                        </h1>
                        <p className="date-display">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </motion.div>

                    <div className="header-badges">
                        <div className="streak-badge">
                            <Flame size={18} />
                            <span>{streak.current} day streak</span>
                        </div>
                        <div className="level-badge">
                            <Zap size={18} />
                            <span>Level {progress.level}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="stats-section">
                <div className="stats-grid">
                    <motion.div
                        className="stat-card calories"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="stat-icon">
                            <Flame size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{formatNumber(todayStats.calories)}</span>
                            <span className="stat-label">Calories Burned</span>
                        </div>
                        <div className="stat-progress">
                            <div
                                className="stat-progress-bar"
                                style={{ width: `${Math.min((todayStats.calories / dailyGoals.calories) * 100, 100)}%` }}
                            />
                        </div>
                        <span className="stat-goal">Goal: {dailyGoals.calories}</span>
                    </motion.div>

                    <motion.div
                        className="stat-card steps"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <div className="stat-icon">
                            <Footprints size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{formatNumber(todayStats.steps)}</span>
                            <span className="stat-label">Steps</span>
                        </div>
                        <div className="stat-progress">
                            <div
                                className="stat-progress-bar"
                                style={{ width: `${Math.min((todayStats.steps / dailyGoals.steps) * 100, 100)}%` }}
                            />
                        </div>
                        <span className="stat-goal">Goal: {formatNumber(dailyGoals.steps)}</span>
                    </motion.div>

                    <motion.div
                        className="stat-card workouts"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="stat-icon">
                            <Dumbbell size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{todayStats.workouts}</span>
                            <span className="stat-label">Workouts</span>
                        </div>
                        <div className="stat-progress">
                            <div
                                className="stat-progress-bar"
                                style={{ width: `${Math.min((todayStats.workouts / dailyGoals.workouts) * 100, 100)}%` }}
                            />
                        </div>
                        <span className="stat-goal">Goal: {dailyGoals.workouts}</span>
                    </motion.div>

                    <motion.div
                        className="stat-card time"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <div className="stat-icon">
                            <Timer size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{formatDuration(todayStats.minutes)}</span>
                            <span className="stat-label">Active Time</span>
                        </div>
                        <div className="stat-progress">
                            <div
                                className="stat-progress-bar"
                                style={{ width: `${Math.min((todayStats.minutes / dailyGoals.minutes) * 100, 100)}%` }}
                            />
                        </div>
                        <span className="stat-goal">Goal: {dailyGoals.minutes} min</span>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Weekly Progress Chart */}
                <Card className="chart-card">
                    <CardHeader>
                        <CardTitle>Weekly Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--background-card)',
                                            border: '1px solid var(--divider)',
                                            borderRadius: '8px',
                                        }}
                                        labelStyle={{ color: 'var(--text-primary)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="calories"
                                        stroke="#8B5CF6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorCalories)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="actions-card">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="quick-actions">
                            <button className="action-btn primary" onClick={() => setIsWorkoutModalOpen(true)}>
                                <Plus size={20} />
                                <span>Log Workout</span>
                            </button>
                            <button className="action-btn">
                                <Target size={20} />
                                <span>Set Goal</span>
                            </button>
                            <button className="action-btn">
                                <TrendingUp size={20} />
                                <span>View Stats</span>
                            </button>
                            <button className="action-btn">
                                <Award size={20} />
                                <span>Achievements</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Goals Progress */}
                <Card className="goals-card">
                    <CardHeader>
                        <CardTitle>Today's Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="goals-rings">
                            <ProgressRing
                                progress={(todayStats.calories / dailyGoals.calories) * 100}
                                size={90}
                                strokeWidth={8}
                                color="#EF4444"
                                label="Calories"
                            />
                            <ProgressRing
                                progress={(todayStats.steps / dailyGoals.steps) * 100}
                                size={90}
                                strokeWidth={8}
                                color="#10B981"
                                label="Steps"
                            />
                            <ProgressRing
                                progress={(todayStats.minutes / dailyGoals.minutes) * 100}
                                size={90}
                                strokeWidth={8}
                                color="#8B5CF6"
                                label="Minutes"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Body Metrics */}
                <Card className="metrics-card">
                    <CardHeader>
                        <CardTitle>Body Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="metrics-list">
                            <div className="metric-item">
                                <span className="metric-label">BMI</span>
                                <div className="metric-value-wrapper">
                                    <span className="metric-value">{bmi.toFixed(1)}</span>
                                    <span className="metric-badge" style={{ background: bmiInfo.color }}>
                                        {bmiInfo.category}
                                    </span>
                                </div>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">BMR</span>
                                <span className="metric-value">{Math.round(bmr)} kcal/day</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">TDEE</span>
                                <span className="metric-value">{tdee} kcal/day</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">Weight</span>
                                <span className="metric-value">{userProfile?.weight} kg</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="activity-card">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentWorkouts.length > 0 ? (
                            <div className="activity-list">
                                {recentWorkouts.slice(0, 4).map((workout, index) => (
                                    <motion.div
                                        key={workout.id}
                                        className="activity-item"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <span className="activity-icon">
                                            {getWorkoutTypeIcon(workout.type)}
                                        </span>
                                        <div className="activity-info">
                                            <span className="activity-name">{workout.type}</span>
                                            <span className="activity-meta">
                                                {workout.duration} min • {workout.calories} kcal
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="activity-arrow" />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-activity">
                                <Dumbbell size={32} />
                                <p>No workouts yet today</p>
                                <Button size="sm">Log Your First Workout</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Motivational Quote */}
                <Card className="quote-card" variant="gradient">
                    <CardContent>
                        <div className="quote-content">
                            <span className="quote-mark">"</span>
                            <p className="quote-text">{dailyQuote.text}</p>
                            <span className="quote-author">— {dailyQuote.author}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Workout Modal */}
            <WorkoutModal
                isOpen={isWorkoutModalOpen}
                onClose={() => setIsWorkoutModalOpen(false)}
            />
        </div>
    );
};

export default DashboardPage;
