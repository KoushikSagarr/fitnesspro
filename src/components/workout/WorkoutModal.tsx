import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Clock, Flame, Dumbbell, Search, Check } from 'lucide-react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { db } from '../../firebase';
import { useUser } from '../../contexts/UserContext';
import { exercises, workoutTypes, muscleGroups } from '../../data/exercises';
import { Button } from '../ui';
import type { Exercise, WorkoutType, MuscleGroup } from '../../types';
import './WorkoutModal.css';

interface WorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface WorkoutExercise {
    exercise: Exercise;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
}

const WorkoutModal: React.FC<WorkoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user, addXP } = useUser();
    const [step, setStep] = useState<'type' | 'exercises' | 'details'>('type');
    const [workoutType, setWorkoutType] = useState<WorkoutType>('strength');
    const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | 'all'>('all');
    const [workoutName, setWorkoutName] = useState('');
    const [workoutDuration, setWorkoutDuration] = useState(30);
    const [workoutNotes, setWorkoutNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const filteredExercises = exercises.filter(ex => {
        const matchesType = ex.type === workoutType;
        const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMuscle = filterMuscle === 'all' || ex.muscleGroups.includes(filterMuscle);
        return matchesType && matchesSearch && matchesMuscle;
    });

    const handleAddExercise = (exercise: Exercise) => {
        const exists = selectedExercises.find(e => e.exercise.id === exercise.id);
        if (exists) {
            setSelectedExercises(selectedExercises.filter(e => e.exercise.id !== exercise.id));
        } else {
            setSelectedExercises([...selectedExercises, {
                exercise,
                sets: 3,
                reps: 10,
                weight: 0,
                duration: 0
            }]);
        }
    };

    const updateExerciseDetails = (exerciseId: string, field: string, value: number) => {
        setSelectedExercises(selectedExercises.map(ex =>
            ex.exercise.id === exerciseId
                ? { ...ex, [field]: Math.max(0, value) }
                : ex
        ));
    };

    const calculateTotalCalories = () => {
        // Simple calculation based on duration and workout type
        const baseCalories = workoutDuration * 7; // Average calories per minute
        const typeMultiplier = workoutType === 'hiit' ? 1.3 : workoutType === 'cardio' ? 1.2 : 1;
        return Math.round(baseCalories * typeMultiplier);
    };

    const handleSaveWorkout = async () => {
        if (!user) return;

        if (selectedExercises.length === 0) {
            toast.error('Please add at least one exercise');
            return;
        }

        setIsLoading(true);

        try {
            const calories = calculateTotalCalories();

            await addDoc(collection(db, 'workouts'), {
                userId: user.uid,
                name: workoutName || `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Workout`,
                type: workoutType,
                exercises: selectedExercises.map(e => ({
                    exerciseId: e.exercise.id,
                    name: e.exercise.name,
                    sets: e.sets,
                    reps: e.reps,
                    weight: e.weight,
                    duration: e.duration,
                })),
                duration: workoutDuration,
                calories,
                notes: workoutNotes,
                date: Timestamp.now(),
                createdAt: Timestamp.now(),
            });

            // Award XP
            const xpEarned = Math.round(workoutDuration * 2 + selectedExercises.length * 5);
            await addXP(xpEarned);

            toast.success(`Workout logged! +${xpEarned} XP 🎉`);
            onSuccess?.();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error saving workout:', error);
            toast.error('Failed to save workout');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setStep('type');
        setWorkoutType('strength');
        setSelectedExercises([]);
        setSearchQuery('');
        setFilterMuscle('all');
        setWorkoutName('');
        setWorkoutDuration(30);
        setWorkoutNotes('');
    };

    const renderStepContent = () => {
        switch (step) {
            case 'type':
                return (
                    <div className="modal-step">
                        <h3>What type of workout?</h3>
                        <div className="workout-type-grid">
                            {workoutTypes.map(type => (
                                <motion.button
                                    key={type.value}
                                    className={`type-card ${workoutType === type.value ? 'selected' : ''}`}
                                    onClick={() => setWorkoutType(type.value)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="type-emoji">{type.emoji}</span>
                                    <span className="type-label">{type.label}</span>
                                    {workoutType === type.value && (
                                        <motion.div
                                            className="type-check"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check size={16} />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button onClick={() => setStep('exercises')}>
                                Continue
                            </Button>
                        </div>
                    </div>
                );

            case 'exercises':
                return (
                    <div className="modal-step exercises-step">
                        <h3>Add exercises</h3>

                        {/* Search and Filter */}
                        <div className="exercise-filters">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search exercises..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                value={filterMuscle}
                                onChange={(e) => setFilterMuscle(e.target.value as MuscleGroup | 'all')}
                                className="muscle-filter"
                            >
                                <option value="all">All Muscles</option>
                                {muscleGroups.map(mg => (
                                    <option key={mg.value} value={mg.value}>{mg.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Exercise List */}
                        <div className="exercise-list">
                            {filteredExercises.map(exercise => {
                                const isSelected = selectedExercises.some(e => e.exercise.id === exercise.id);
                                return (
                                    <motion.button
                                        key={exercise.id}
                                        className={`exercise-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleAddExercise(exercise)}
                                        whileHover={{ x: 4 }}
                                    >
                                        <div className="exercise-info">
                                            <span className="exercise-name">{exercise.name}</span>
                                            <span className="exercise-muscles">
                                                {exercise.muscleGroups.slice(0, 2).join(', ')}
                                            </span>
                                        </div>
                                        <span className={`exercise-difficulty ${exercise.difficulty}`}>
                                            {exercise.difficulty}
                                        </span>
                                        {isSelected && <Check size={18} className="exercise-check" />}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Selected Count */}
                        <div className="selected-count">
                            {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
                        </div>

                        <div className="modal-actions">
                            <Button variant="ghost" onClick={() => setStep('type')}>Back</Button>
                            <Button
                                onClick={() => setStep('details')}
                                disabled={selectedExercises.length === 0}
                            >
                                Continue ({selectedExercises.length})
                            </Button>
                        </div>
                    </div>
                );

            case 'details':
                return (
                    <div className="modal-step details-step">
                        <h3>Workout details</h3>

                        {/* Workout Name */}
                        <div className="form-group">
                            <label>Workout Name (optional)</label>
                            <input
                                type="text"
                                placeholder="e.g., Morning Push Day"
                                value={workoutName}
                                onChange={(e) => setWorkoutName(e.target.value)}
                            />
                        </div>

                        {/* Duration */}
                        <div className="form-group">
                            <label>Duration (minutes)</label>
                            <div className="duration-input">
                                <button onClick={() => setWorkoutDuration(Math.max(5, workoutDuration - 5))}>
                                    <Minus size={16} />
                                </button>
                                <span className="duration-value">{workoutDuration}</span>
                                <button onClick={() => setWorkoutDuration(workoutDuration + 5)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Exercise Details */}
                        <div className="exercise-details-list">
                            <label>Exercise Details</label>
                            {selectedExercises.map(ex => (
                                <div key={ex.exercise.id} className="exercise-detail-row">
                                    <span className="exercise-detail-name">{ex.exercise.name}</span>
                                    <div className="exercise-detail-inputs">
                                        <div className="detail-input">
                                            <label>Sets</label>
                                            <input
                                                type="number"
                                                value={ex.sets}
                                                onChange={(e) => updateExerciseDetails(ex.exercise.id, 'sets', parseInt(e.target.value) || 0)}
                                                min="1"
                                            />
                                        </div>
                                        <div className="detail-input">
                                            <label>Reps</label>
                                            <input
                                                type="number"
                                                value={ex.reps}
                                                onChange={(e) => updateExerciseDetails(ex.exercise.id, 'reps', parseInt(e.target.value) || 0)}
                                                min="1"
                                            />
                                        </div>
                                        <div className="detail-input">
                                            <label>Weight</label>
                                            <input
                                                type="number"
                                                value={ex.weight || ''}
                                                onChange={(e) => updateExerciseDetails(ex.exercise.id, 'weight', parseInt(e.target.value) || 0)}
                                                placeholder="kg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Notes */}
                        <div className="form-group">
                            <label>Notes (optional)</label>
                            <textarea
                                placeholder="How did it feel? Any PRs?"
                                value={workoutNotes}
                                onChange={(e) => setWorkoutNotes(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Summary */}
                        <div className="workout-summary">
                            <div className="summary-item">
                                <Clock size={18} />
                                <span>{workoutDuration} min</span>
                            </div>
                            <div className="summary-item">
                                <Dumbbell size={18} />
                                <span>{selectedExercises.length} exercises</span>
                            </div>
                            <div className="summary-item">
                                <Flame size={18} />
                                <span>~{calculateTotalCalories()} cal</span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <Button variant="ghost" onClick={() => setStep('exercises')}>Back</Button>
                            <Button
                                onClick={handleSaveWorkout}
                                isLoading={isLoading}
                            >
                                Log Workout 💪
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="workout-modal"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <button className="modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>

                        <div className="modal-header">
                            <Dumbbell size={24} />
                            <h2>Log Workout</h2>
                        </div>

                        {/* Progress Steps */}
                        <div className="modal-progress">
                            {['type', 'exercises', 'details'].map((s, i) => (
                                <div
                                    key={s}
                                    className={`progress-step ${step === s ? 'active' : ''} ${['type', 'exercises', 'details'].indexOf(step) > i ? 'completed' : ''
                                        }`}
                                >
                                    <span>{i + 1}</span>
                                </div>
                            ))}
                        </div>

                        {renderStepContent()}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WorkoutModal;
