import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Target,
    Flame,
    Footprints,
    Dumbbell,
    Droplet,
    TrendingUp,
    Check,
    X,
    Trash2
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent, Button, ProgressRing } from '../components/ui';
import './GoalsPage.css';

interface Goal {
    id: string;
    type: string;
    target: number;
    current: number;
    unit: string;
    frequency: string;
    isActive: boolean;
}

const goalTypes = [
    { id: 'calories_burned', label: 'Calories Burned', icon: Flame, unit: 'cal', color: '#EF4444', defaultTarget: 500 },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, unit: 'workouts', color: '#8B5CF6', defaultTarget: 5 },
    { id: 'steps', label: 'Steps', icon: Footprints, unit: 'steps', color: '#10B981', defaultTarget: 10000 },
    { id: 'water_intake', label: 'Water Intake', icon: Droplet, unit: 'glasses', color: '#06B6D4', defaultTarget: 8 },
    { id: 'workout_minutes', label: 'Active Minutes', icon: TrendingUp, unit: 'min', color: '#F59E0B', defaultTarget: 150 },
];

const GoalsPage: React.FC = () => {
    const { user } = useUser();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newGoalType, setNewGoalType] = useState(goalTypes[0]);
    const [newGoalTarget, setNewGoalTarget] = useState(goalTypes[0].defaultTarget);
    const [newGoalFrequency, setNewGoalFrequency] = useState<'daily' | 'weekly'>('weekly');

    useEffect(() => {
        if (!user) return;

        const goalsQuery = query(
            collection(db, 'goals'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(goalsQuery, (snapshot) => {
            const goalsList: Goal[] = [];
            snapshot.forEach((doc) => {
                goalsList.push({
                    id: doc.id,
                    ...doc.data(),
                } as Goal);
            });
            setGoals(goalsList);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching goals:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleAddGoal = async () => {
        if (!user) return;

        try {
            await addDoc(collection(db, 'goals'), {
                userId: user.uid,
                type: newGoalType.id,
                target: newGoalTarget,
                current: 0,
                unit: newGoalType.unit,
                frequency: newGoalFrequency,
                isActive: true,
                createdAt: Timestamp.now(),
            });

            toast.success('Goal created! 🎯');
            setShowAddModal(false);
            setNewGoalTarget(goalTypes[0].defaultTarget);
        } catch (error) {
            toast.error('Failed to create goal');
        }
    };

    const handleUpdateProgress = async (goalId: string, newValue: number) => {
        try {
            await updateDoc(doc(db, 'goals', goalId), {
                current: Math.max(0, newValue),
            });
        } catch (error) {
            toast.error('Failed to update progress');
        }
    };

    const handleDeleteGoal = async (goalId: string) => {
        if (!confirm('Delete this goal?')) return;

        try {
            await deleteDoc(doc(db, 'goals', goalId));
            toast.success('Goal deleted');
        } catch (error) {
            toast.error('Failed to delete goal');
        }
    };

    const getGoalInfo = (type: string) => {
        return goalTypes.find(g => g.id === type) || goalTypes[0];
    };

    return (
        <div className="goals-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>My Goals</h1>
                    <p>Set targets and track your progress</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus size={18} />}>
                    New Goal
                </Button>
            </header>

            {/* Goals Grid */}
            <div className="goals-grid">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="spinner" />
                        <p>Loading goals...</p>
                    </div>
                ) : goals.length === 0 ? (
                    <Card className="empty-state full-width">
                        <CardContent>
                            <Target size={48} />
                            <h3>No goals yet</h3>
                            <p>Create your first goal to start tracking progress</p>
                            <Button onClick={() => setShowAddModal(true)}>
                                Create Your First Goal
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    goals.map((goal, index) => {
                        const info = getGoalInfo(goal.type);
                        const Icon = info.icon;
                        const progress = Math.min(100, (goal.current / goal.target) * 100);
                        const isComplete = goal.current >= goal.target;

                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className={`goal-card ${isComplete ? 'complete' : ''}`}>
                                    <CardContent>
                                        <div className="goal-header">
                                            <div className="goal-icon" style={{ background: `${info.color}20`, color: info.color }}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="goal-actions">
                                                <button className="action-btn" onClick={() => handleDeleteGoal(goal.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="goal-info">
                                            <h3>{info.label}</h3>
                                            <span className="goal-frequency">{goal.frequency}</span>
                                        </div>

                                        <div className="goal-progress">
                                            <ProgressRing
                                                progress={progress}
                                                size={100}
                                                strokeWidth={8}
                                                color={info.color}
                                            >
                                                {isComplete ? (
                                                    <Check size={32} />
                                                ) : (
                                                    <span className="progress-text">{Math.round(progress)}%</span>
                                                )}
                                            </ProgressRing>
                                        </div>

                                        <div className="goal-values">
                                            <div className="current-value">
                                                <span className="value">{goal.current}</span>
                                                <span className="separator">/</span>
                                                <span className="target">{goal.target}</span>
                                                <span className="unit">{goal.unit}</span>
                                            </div>
                                        </div>

                                        <div className="goal-controls">
                                            <button
                                                className="adjust-btn"
                                                onClick={() => handleUpdateProgress(goal.id, goal.current - 1)}
                                            >
                                                -
                                            </button>
                                            <button
                                                className="adjust-btn add"
                                                onClick={() => handleUpdateProgress(goal.id, goal.current + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Add Goal Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            className="goal-modal"
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        >
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>

                            <div className="modal-header">
                                <Target size={24} />
                                <h2>Create New Goal</h2>
                            </div>

                            <div className="modal-content">
                                <div className="form-group">
                                    <label>Goal Type</label>
                                    <div className="goal-type-grid">
                                        {goalTypes.map(type => (
                                            <button
                                                key={type.id}
                                                className={`type-option ${newGoalType.id === type.id ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setNewGoalType(type);
                                                    setNewGoalTarget(type.defaultTarget);
                                                }}
                                                style={{
                                                    borderColor: newGoalType.id === type.id ? type.color : undefined,
                                                    background: newGoalType.id === type.id ? `${type.color}15` : undefined
                                                }}
                                            >
                                                <type.icon size={20} style={{ color: type.color }} />
                                                <span>{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Target</label>
                                    <div className="target-input">
                                        <input
                                            type="number"
                                            value={newGoalTarget}
                                            onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 0)}
                                            min="1"
                                        />
                                        <span className="unit">{newGoalType.unit}</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Frequency</label>
                                    <div className="frequency-options">
                                        <button
                                            className={`freq-btn ${newGoalFrequency === 'daily' ? 'active' : ''}`}
                                            onClick={() => setNewGoalFrequency('daily')}
                                        >
                                            Daily
                                        </button>
                                        <button
                                            className={`freq-btn ${newGoalFrequency === 'weekly' ? 'active' : ''}`}
                                            onClick={() => setNewGoalFrequency('weekly')}
                                        >
                                            Weekly
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddGoal}>
                                    Create Goal
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GoalsPage;
