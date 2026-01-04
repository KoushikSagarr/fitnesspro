import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Droplet,
    Apple,
    Coffee,
    Utensils,
    Moon,
    X
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressRing } from '../components/ui';
import './NutritionPage.css';

interface MealEntry {
    id: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    date: any;
}

const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#F59E0B' },
    { id: 'lunch', label: 'Lunch', icon: Utensils, color: '#10B981' },
    { id: 'dinner', label: 'Dinner', icon: Moon, color: '#8B5CF6' },
    { id: 'snack', label: 'Snack', icon: Apple, color: '#EF4444' },
];

const NutritionPage: React.FC = () => {
    const { user } = useUser();
    const [meals, setMeals] = useState<MealEntry[]>([]);
    const [waterGlasses, setWaterGlasses] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMeal, setNewMeal] = useState({
        type: 'breakfast' as MealEntry['type'],
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    });

    // Daily goals (can be customized based on TDEE)
    const dailyGoals = {
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 65,
        water: 8,
    };

    useEffect(() => {
        if (!user) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const mealsQuery = query(
            collection(db, 'meals'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(mealsQuery, (snapshot) => {
            const mealList: MealEntry[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                const mealDate = data.date?.toDate();
                if (mealDate && mealDate >= today) {
                    mealList.push({
                        id: doc.id,
                        ...data,
                    } as MealEntry);
                }
            });
            setMeals(mealList);
        });

        return () => unsubscribe();
    }, [user]);

    const todayTotals = meals.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const handleAddMeal = async () => {
        if (!user || !newMeal.name) return;

        try {
            await addDoc(collection(db, 'meals'), {
                userId: user.uid,
                ...newMeal,
                date: Timestamp.now(),
            });
            toast.success('Meal logged! 🍽️');
            setShowAddModal(false);
            setNewMeal({ type: 'breakfast', name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
        } catch (error) {
            toast.error('Failed to log meal');
        }
    };

    const handleDeleteMeal = async (mealId: string) => {
        try {
            await deleteDoc(doc(db, 'meals', mealId));
            toast.success('Meal removed');
        } catch (error) {
            toast.error('Failed to remove meal');
        }
    };

    return (
        <div className="nutrition-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>Nutrition</h1>
                    <p>Track your daily intake</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus size={18} />}>
                    Log Meal
                </Button>
            </header>

            {/* Daily Overview */}
            <div className="nutrition-overview">
                <Card className="calories-card">
                    <CardContent>
                        <div className="calories-main">
                            <ProgressRing
                                progress={(todayTotals.calories / dailyGoals.calories) * 100}
                                size={140}
                                strokeWidth={10}
                                color={todayTotals.calories > dailyGoals.calories ? '#EF4444' : '#10B981'}
                            >
                                <div className="calories-center">
                                    <span className="calories-value">{todayTotals.calories}</span>
                                    <span className="calories-label">/ {dailyGoals.calories} cal</span>
                                </div>
                            </ProgressRing>
                        </div>
                        <div className="macros-row">
                            <div className="macro-item">
                                <div className="macro-bar protein">
                                    <div
                                        className="macro-fill"
                                        style={{ width: `${Math.min(100, (todayTotals.protein / dailyGoals.protein) * 100)}%` }}
                                    />
                                </div>
                                <span className="macro-label">Protein</span>
                                <span className="macro-value">{todayTotals.protein}g / {dailyGoals.protein}g</span>
                            </div>
                            <div className="macro-item">
                                <div className="macro-bar carbs">
                                    <div
                                        className="macro-fill"
                                        style={{ width: `${Math.min(100, (todayTotals.carbs / dailyGoals.carbs) * 100)}%` }}
                                    />
                                </div>
                                <span className="macro-label">Carbs</span>
                                <span className="macro-value">{todayTotals.carbs}g / {dailyGoals.carbs}g</span>
                            </div>
                            <div className="macro-item">
                                <div className="macro-bar fat">
                                    <div
                                        className="macro-fill"
                                        style={{ width: `${Math.min(100, (todayTotals.fat / dailyGoals.fat) * 100)}%` }}
                                    />
                                </div>
                                <span className="macro-label">Fat</span>
                                <span className="macro-value">{todayTotals.fat}g / {dailyGoals.fat}g</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Water Tracker */}
                <Card className="water-card">
                    <CardHeader>
                        <CardTitle>
                            <Droplet size={20} /> Water Intake
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="water-glasses">
                            {Array.from({ length: dailyGoals.water }).map((_, i) => (
                                <button
                                    key={i}
                                    className={`water-glass ${i < waterGlasses ? 'filled' : ''}`}
                                    onClick={() => setWaterGlasses(i < waterGlasses ? i : i + 1)}
                                >
                                    <Droplet size={20} />
                                </button>
                            ))}
                        </div>
                        <p className="water-label">{waterGlasses} / {dailyGoals.water} glasses</p>
                    </CardContent>
                </Card>
            </div>

            {/* Meals by Type */}
            <div className="meals-section">
                <h2>Today's Meals</h2>
                <div className="meals-grid">
                    {mealTypes.map(type => {
                        const typeMeals = meals.filter(m => m.type === type.id);
                        const typeTotal = typeMeals.reduce((sum, m) => sum + m.calories, 0);

                        return (
                            <Card key={type.id} className="meal-type-card">
                                <CardHeader>
                                    <div className="meal-type-header">
                                        <div className="meal-type-icon" style={{ background: `${type.color}20`, color: type.color }}>
                                            <type.icon size={20} />
                                        </div>
                                        <div className="meal-type-info">
                                            <CardTitle>{type.label}</CardTitle>
                                            <span className="meal-type-calories">{typeTotal} cal</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {typeMeals.length === 0 ? (
                                        <p className="no-meals">No meals logged</p>
                                    ) : (
                                        <div className="meal-list">
                                            {typeMeals.map(meal => (
                                                <div key={meal.id} className="meal-item">
                                                    <span className="meal-name">{meal.name}</span>
                                                    <span className="meal-cals">{meal.calories} cal</span>
                                                    <button
                                                        className="meal-delete"
                                                        onClick={() => handleDeleteMeal(meal.id)}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Add Meal Modal */}
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
                            className="meal-modal"
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        >
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>

                            <div className="modal-header">
                                <Utensils size={24} />
                                <h2>Log Meal</h2>
                            </div>

                            <div className="modal-content">
                                <div className="form-group">
                                    <label>Meal Type</label>
                                    <div className="meal-type-options">
                                        {mealTypes.map(type => (
                                            <button
                                                key={type.id}
                                                className={`type-btn ${newMeal.type === type.id ? 'active' : ''}`}
                                                onClick={() => setNewMeal({ ...newMeal, type: type.id as MealEntry['type'] })}
                                                style={{
                                                    borderColor: newMeal.type === type.id ? type.color : undefined,
                                                    background: newMeal.type === type.id ? `${type.color}15` : undefined
                                                }}
                                            >
                                                <type.icon size={18} style={{ color: type.color }} />
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Food Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Grilled Chicken Salad"
                                        value={newMeal.name}
                                        onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Calories</label>
                                        <input
                                            type="number"
                                            value={newMeal.calories || ''}
                                            onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Protein (g)</label>
                                        <input
                                            type="number"
                                            value={newMeal.protein || ''}
                                            onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Carbs (g)</label>
                                        <input
                                            type="number"
                                            value={newMeal.carbs || ''}
                                            onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fat (g)</label>
                                        <input
                                            type="number"
                                            value={newMeal.fat || ''}
                                            onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddMeal} disabled={!newMeal.name}>
                                    Log Meal
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NutritionPage;
