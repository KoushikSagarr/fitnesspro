import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Flame,
    Dumbbell,
    Clock,
    Activity,
    Award
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar
} from 'recharts';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { formatNumber } from '../utils';
import './ProgressPage.css';

const ProgressPage: React.FC = () => {
    const { user, streak, progress } = useUser();
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
    const [workoutStats, setWorkoutStats] = useState({
        totalWorkouts: 0,
        totalCalories: 0,
        totalMinutes: 0,
        avgPerSession: 0,
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [weeklyComparison, setWeeklyComparison] = useState({
        current: 0,
        previous: 0,
        change: 0,
    });

    useEffect(() => {
        if (!user) return;

        const workoutsQuery = query(
            collection(db, 'workouts'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(workoutsQuery, (snapshot) => {
            let totalCals = 0;
            let totalMins = 0;
            let thisWeek = 0;
            let lastWeek = 0;
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

            const dailyData: { [key: string]: { calories: number; minutes: number; workouts: number } } = {};

            snapshot.forEach((doc) => {
                const data = doc.data();
                totalCals += data.calories || 0;
                totalMins += data.duration || 0;

                const workoutDate = data.date?.toDate();
                if (workoutDate) {
                    if (workoutDate > weekAgo) thisWeek++;
                    else if (workoutDate > twoWeeksAgo) lastWeek++;

                    const dateKey = workoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    if (!dailyData[dateKey]) {
                        dailyData[dateKey] = { calories: 0, minutes: 0, workouts: 0 };
                    }
                    dailyData[dateKey].calories += data.calories || 0;
                    dailyData[dateKey].minutes += data.duration || 0;
                    dailyData[dateKey].workouts += 1;
                }
            });

            setWorkoutStats({
                totalWorkouts: snapshot.size,
                totalCalories: totalCals,
                totalMinutes: totalMins,
                avgPerSession: snapshot.size > 0 ? Math.round(totalMins / snapshot.size) : 0,
            });

            setWeeklyComparison({
                current: thisWeek,
                previous: lastWeek,
                change: lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0,
            });

            // Convert to chart data - last 7 days
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                days.push({
                    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    calories: dailyData[key]?.calories || 0,
                    minutes: dailyData[key]?.minutes || 0,
                    workouts: dailyData[key]?.workouts || 0,
                });
            }
            setChartData(days);
        });

        return () => unsubscribe();
    }, [user, timeRange]);

    const statCards = [
        {
            label: 'Total Workouts',
            value: workoutStats.totalWorkouts,
            icon: Dumbbell,
            color: '#8B5CF6',
            suffix: ''
        },
        {
            label: 'Calories Burned',
            value: formatNumber(workoutStats.totalCalories),
            icon: Flame,
            color: '#EF4444',
            suffix: 'cal'
        },
        {
            label: 'Total Time',
            value: Math.round(workoutStats.totalMinutes / 60),
            icon: Clock,
            color: '#F59E0B',
            suffix: 'hrs'
        },
        {
            label: 'Avg. Session',
            value: workoutStats.avgPerSession,
            icon: Activity,
            color: '#10B981',
            suffix: 'min'
        },
    ];

    return (
        <div className="progress-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>Progress</h1>
                    <p>Track your fitness journey over time</p>
                </div>
                <div className="time-toggle">
                    {(['week', 'month', 'year'] as const).map((range) => (
                        <button
                            key={range}
                            className={`toggle-btn ${timeRange === range ? 'active' : ''}`}
                            onClick={() => setTimeRange(range)}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            {/* Stats Overview */}
            <div className="stats-overview">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">
                                {stat.value}
                                <span className="stat-suffix">{stat.suffix}</span>
                            </span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Calories Chart */}
                <Card className="chart-card">
                    <CardHeader>
                        <CardTitle>Calories Burned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--background-card)',
                                            border: '1px solid var(--divider)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="calories" stroke="#EF4444" strokeWidth={2} fill="url(#colorCals)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Workout Duration Chart */}
                <Card className="chart-card">
                    <CardHeader>
                        <CardTitle>Workout Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={chartData}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--background-card)',
                                            border: '1px solid var(--divider)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="minutes" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly Comparison */}
                <Card className="comparison-card">
                    <CardHeader>
                        <CardTitle>Weekly Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="comparison-content">
                            <div className="comparison-stat">
                                <span className="comparison-value">{weeklyComparison.current}</span>
                                <span className="comparison-label">This Week</span>
                            </div>
                            <div className="comparison-change">
                                {weeklyComparison.change >= 0 ? (
                                    <TrendingUp size={32} className="positive" />
                                ) : (
                                    <TrendingDown size={32} className="negative" />
                                )}
                                <span className={weeklyComparison.change >= 0 ? 'positive' : 'negative'}>
                                    {weeklyComparison.change > 0 ? '+' : ''}{weeklyComparison.change}%
                                </span>
                            </div>
                            <div className="comparison-stat">
                                <span className="comparison-value secondary">{weeklyComparison.previous}</span>
                                <span className="comparison-label">Last Week</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Streak & Level Card */}
                <Card className="streak-level-card">
                    <CardHeader>
                        <CardTitle>Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="achievement-stats">
                            <div className="achievement-item">
                                <div className="achievement-icon streak">
                                    <Flame size={24} />
                                </div>
                                <div className="achievement-info">
                                    <span className="achievement-value">{streak.current}</span>
                                    <span className="achievement-label">Day Streak</span>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="achievement-item">
                                <div className="achievement-icon level">
                                    <Award size={24} />
                                </div>
                                <div className="achievement-info">
                                    <span className="achievement-value">Level {progress.level}</span>
                                    <span className="achievement-label">{progress.currentXP}/{progress.xpToNextLevel} XP</span>
                                </div>
                            </div>
                        </div>
                        <div className="xp-bar">
                            <div
                                className="xp-fill"
                                style={{ width: `${(progress.currentXP / progress.xpToNextLevel) * 100}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProgressPage;
