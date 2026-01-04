import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Calendar,
    Flame,
    Clock,
    Dumbbell,
    ChevronRight,
    Search,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent, Button } from '../components/ui';
import { WorkoutModal } from '../components/workout';
import { formatNumber, getWorkoutTypeIcon } from '../utils';
import './WorkoutsPage.css';

interface WorkoutData {
    id: string;
    name: string;
    type: string;
    duration: number;
    calories: number;
    exercises: any[];
    notes?: string;
    date: any;
}

const WorkoutsPage: React.FC = () => {
    const { user } = useUser();
    const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Stats
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        totalCalories: 0,
        totalMinutes: 0,
        thisWeek: 0,
    });

    useEffect(() => {
        if (!user) return;

        const workoutsQuery = query(
            collection(db, 'workouts'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(workoutsQuery, (snapshot) => {
            const workoutList: WorkoutData[] = [];
            let totalCals = 0;
            let totalMins = 0;
            let weekCount = 0;
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            snapshot.forEach((doc) => {
                const data = doc.data();
                workoutList.push({
                    id: doc.id,
                    ...data,
                } as WorkoutData);

                totalCals += data.calories || 0;
                totalMins += data.duration || 0;

                const workoutDate = data.date?.toDate();
                if (workoutDate && workoutDate > weekAgo) {
                    weekCount++;
                }
            });

            setWorkouts(workoutList);
            setStats({
                totalWorkouts: workoutList.length,
                totalCalories: totalCals,
                totalMinutes: totalMins,
                thisWeek: weekCount,
            });
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching workouts:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const filteredWorkouts = workouts.filter(w => {
        const matchesType = filterType === 'all' || w.type === filterType;
        const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const handleDeleteWorkout = async (workoutId: string) => {
        if (!confirm('Are you sure you want to delete this workout?')) return;

        try {
            await deleteDoc(doc(db, 'workouts', workoutId));
            toast.success('Workout deleted');
        } catch (error) {
            toast.error('Failed to delete workout');
        }
    };

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Group workouts by date
    const groupedWorkouts = filteredWorkouts.reduce((groups: { [key: string]: WorkoutData[] }, workout) => {
        const date = formatDate(workout.date);
        if (!groups[date]) groups[date] = [];
        groups[date].push(workout);
        return groups;
    }, {});

    return (
        <div className="workouts-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>Workouts</h1>
                    <p>Track your fitness journey</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={18} />}>
                    Log Workout
                </Button>
            </header>

            {/* Stats Cards */}
            <div className="stats-row">
                <motion.div
                    className="stat-mini"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="stat-icon workouts">
                        <Dumbbell size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalWorkouts}</span>
                        <span className="stat-label">Total Workouts</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-mini"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <div className="stat-icon calories">
                        <Flame size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{formatNumber(stats.totalCalories)}</span>
                        <span className="stat-label">Calories Burned</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-mini"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="stat-icon time">
                        <Clock size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{Math.round(stats.totalMinutes / 60)}h</span>
                        <span className="stat-label">Total Time</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-mini"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <div className="stat-icon week">
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.thisWeek}</span>
                        <span className="stat-label">This Week</span>
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="filters-row">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search workouts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-buttons">
                    {['all', 'strength', 'cardio', 'hiit', 'flexibility'].map((type) => (
                        <button
                            key={type}
                            className={`filter-btn ${filterType === type ? 'active' : ''}`}
                            onClick={() => setFilterType(type)}
                        >
                            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Workout List */}
            <div className="workouts-list">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="spinner" />
                        <p>Loading workouts...</p>
                    </div>
                ) : Object.keys(groupedWorkouts).length === 0 ? (
                    <Card className="empty-state">
                        <CardContent>
                            <Dumbbell size={48} />
                            <h3>No workouts yet</h3>
                            <p>Start logging your workouts to track your progress</p>
                            <Button onClick={() => setIsModalOpen(true)}>
                                Log Your First Workout
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    Object.entries(groupedWorkouts).map(([date, dayWorkouts]) => (
                        <div key={date} className="workout-group">
                            <div className="group-header">
                                <Calendar size={16} />
                                <span>{date}</span>
                            </div>
                            <AnimatePresence>
                                {dayWorkouts.map((workout, index) => (
                                    <motion.div
                                        key={workout.id}
                                        className="workout-card"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="workout-icon">
                                            {getWorkoutTypeIcon(workout.type)}
                                        </div>
                                        <div className="workout-info">
                                            <h4>{workout.name}</h4>
                                            <div className="workout-meta">
                                                <span className="workout-type">{workout.type}</span>
                                                <span className="workout-exercises">
                                                    {workout.exercises?.length || 0} exercises
                                                </span>
                                            </div>
                                        </div>
                                        <div className="workout-stats">
                                            <div className="stat">
                                                <Clock size={14} />
                                                <span>{workout.duration} min</span>
                                            </div>
                                            <div className="stat">
                                                <Flame size={14} />
                                                <span>{workout.calories} cal</span>
                                            </div>
                                        </div>
                                        <div className="workout-actions">
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeleteWorkout(workout.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="action-btn view">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ))
                )}
            </div>

            {/* Workout Modal */}
            <WorkoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default WorkoutsPage;
