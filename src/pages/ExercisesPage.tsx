import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Dumbbell,
    X,
    ChevronDown,
    ChevronUp,
    Flame,
    Target
} from 'lucide-react';
import { exercises, muscleGroups, workoutTypes } from '../data/exercises';
import { Card, CardContent } from '../components/ui';
import type { MuscleGroup, WorkoutType } from '../types';
import './ExercisesPage.css';

const ExercisesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<WorkoutType | 'all'>('all');
    const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | 'all'>('all');
    const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ex.muscleGroups.some(mg => mg.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = filterType === 'all' || ex.type === filterType;
        const matchesMuscle = filterMuscle === 'all' || ex.muscleGroups.includes(filterMuscle);
        const matchesDifficulty = filterDifficulty === 'all' || ex.difficulty === filterDifficulty;
        return matchesSearch && matchesType && matchesMuscle && matchesDifficulty;
    });

    const clearFilters = () => {
        setFilterType('all');
        setFilterMuscle('all');
        setFilterDifficulty('all');
        setSearchQuery('');
    };

    const hasActiveFilters = filterType !== 'all' || filterMuscle !== 'all' || filterDifficulty !== 'all' || searchQuery !== '';

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '#10B981';
            case 'intermediate': return '#F59E0B';
            case 'advanced': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getTypeEmoji = (type: string) => {
        switch (type) {
            case 'strength': return '🏋️';
            case 'cardio': return '🏃';
            case 'hiit': return '⚡';
            case 'flexibility': return '🧘';
            default: return '💪';
        }
    };

    return (
        <div className="exercises-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>Exercise Library</h1>
                    <p>{exercises.length} exercises available</p>
                </div>
            </header>

            {/* Search and Filter Bar */}
            <div className="search-filter-bar">
                <div className="search-box large">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search exercises by name or muscle group..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="clear-btn" onClick={() => setSearchQuery('')}>
                            <X size={16} />
                        </button>
                    )}
                </div>
                <button
                    className={`filter-toggle ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter size={18} />
                    <span>Filters</span>
                    {hasActiveFilters && <span className="filter-badge" />}
                </button>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        className="filters-panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div className="filter-group">
                            <label>Workout Type</label>
                            <div className="filter-options">
                                <button
                                    className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilterType('all')}
                                >
                                    All Types
                                </button>
                                {workoutTypes.map(type => (
                                    <button
                                        key={type.value}
                                        className={`filter-chip ${filterType === type.value ? 'active' : ''}`}
                                        onClick={() => setFilterType(type.value)}
                                    >
                                        {type.emoji} {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Muscle Group</label>
                            <div className="filter-options">
                                <button
                                    className={`filter-chip ${filterMuscle === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilterMuscle('all')}
                                >
                                    All Muscles
                                </button>
                                {muscleGroups.map(mg => (
                                    <button
                                        key={mg.value}
                                        className={`filter-chip ${filterMuscle === mg.value ? 'active' : ''}`}
                                        onClick={() => setFilterMuscle(mg.value)}
                                    >
                                        {mg.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Difficulty</label>
                            <div className="filter-options">
                                {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
                                    <button
                                        key={diff}
                                        className={`filter-chip ${filterDifficulty === diff ? 'active' : ''}`}
                                        onClick={() => setFilterDifficulty(diff)}
                                    >
                                        {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <button className="clear-filters-btn" onClick={clearFilters}>
                                <X size={16} />
                                Clear All Filters
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Count */}
            <div className="results-info">
                <span>Showing {filteredExercises.length} of {exercises.length} exercises</span>
            </div>

            {/* Exercise Grid */}
            <div className="exercises-grid">
                {filteredExercises.map((exercise, index) => {
                    const isExpanded = expandedExercise === exercise.id;

                    return (
                        <motion.div
                            key={exercise.id}
                            className={`exercise-card ${isExpanded ? 'expanded' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            layout
                        >
                            <div
                                className="exercise-header"
                                onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                            >
                                <div className="exercise-type-badge">
                                    {getTypeEmoji(exercise.type)}
                                </div>
                                <div className="exercise-info">
                                    <h3>{exercise.name}</h3>
                                    <div className="exercise-tags">
                                        {exercise.muscleGroups.slice(0, 3).map(mg => (
                                            <span key={mg} className="muscle-tag">{mg}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="exercise-meta">
                                    <span
                                        className="difficulty-badge"
                                        style={{ color: getDifficultyColor(exercise.difficulty) }}
                                    >
                                        {exercise.difficulty}
                                    </span>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        className="exercise-details"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        {/* Stats */}
                                        <div className="exercise-stats">
                                            <div className="ex-stat">
                                                <Flame size={16} />
                                                <span>{exercise.caloriesPerMinute} cal/min</span>
                                            </div>
                                            <div className="ex-stat">
                                                <Target size={16} />
                                                <span>{exercise.muscleGroups.length} muscle groups</span>
                                            </div>
                                            {exercise.equipment.length > 0 && (
                                                <div className="ex-stat">
                                                    <Dumbbell size={16} />
                                                    <span>{exercise.equipment.join(', ')}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Instructions */}
                                        <div className="section">
                                            <h4>Instructions</h4>
                                            <ol className="instructions-list">
                                                {exercise.instructions.map((step, i) => (
                                                    <li key={i}>{step}</li>
                                                ))}
                                            </ol>
                                        </div>

                                        {/* Tips */}
                                        {exercise.tips && exercise.tips.length > 0 && (
                                            <div className="section">
                                                <h4>Pro Tips</h4>
                                                <ul className="tips-list">
                                                    {exercise.tips.map((tip, i) => (
                                                        <li key={i}>{tip}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {filteredExercises.length === 0 && (
                <Card className="empty-state">
                    <CardContent>
                        <Dumbbell size={48} />
                        <h3>No exercises found</h3>
                        <p>Try adjusting your filters or search query</p>
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ExercisesPage;
