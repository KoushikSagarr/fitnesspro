// ==========================================
// FitTrack Pro - Utility Functions
// ==========================================

import { format, formatDistanceToNow, isToday, isYesterday, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns';

// ==========================================
// Date Utilities
// ==========================================

export const formatDate = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
};

export const formatDateTime = (date: Date): string => {
    return format(date, 'MMM d, yyyy h:mm a');
};

export const formatTime = (date: Date): string => {
    return format(date, 'h:mm a');
};

export const formatRelativeTime = (date: Date): string => {
    return formatDistanceToNow(date, { addSuffix: true });
};

export const getWeekDays = (date: Date = new Date()): Date[] => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
};

export const getLast7Days = (): Date[] => {
    return Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
};

export const getLast30Days = (): Date[] => {
    return Array.from({ length: 30 }, (_, i) => subDays(new Date(), 29 - i));
};

// ==========================================
// Number Formatting
// ==========================================

export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
};

export const formatCalories = (calories: number): string => {
    return `${Math.round(calories)} kcal`;
};

export const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
};

export const formatWeight = (kg: number, unit: 'kg' | 'lbs' = 'kg'): string => {
    if (unit === 'lbs') {
        return `${(kg * 2.20462).toFixed(1)} lbs`;
    }
    return `${kg.toFixed(1)} kg`;
};

export const formatDistance = (km: number): string => {
    if (km < 1) {
        return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(2)} km`;
};

// ==========================================
// Fitness Calculations
// ==========================================

// MET values for different activities
export const MET_VALUES: Record<string, number> = {
    running: 8.0,
    cycling: 7.5,
    weightlifting: 3.0,
    yoga: 2.5,
    swimming: 6.0,
    hiit: 8.0,
    cardio: 6.0,
    strength: 3.5,
    flexibility: 2.5,
    sports: 7.0,
    walking: 3.5,
    custom: 4.0,
};

export const calculateCaloriesBurned = (
    duration: number, // minutes
    weight: number, // kg
    workoutType: string
): number => {
    const met = MET_VALUES[workoutType] || MET_VALUES.custom;
    const caloriesPerMinute = (met * 3.5 * weight) / 200;
    return Math.round(caloriesPerMinute * duration);
};

export const calculateBMI = (weight: number, height: number): number => {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3B82F6' };
    if (bmi < 25) return { category: 'Normal', color: '#10B981' };
    if (bmi < 30) return { category: 'Overweight', color: '#F59E0B' };
    return { category: 'Obese', color: '#EF4444' };
};

export const calculateBMR = (
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female'
): number => {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    }
    return 10 * weight + 6.25 * height - 5 * age - 161;
};

export const calculateTDEE = (
    bmr: number,
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number => {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };
    return Math.round(bmr * multipliers[activityLevel]);
};

// ==========================================
// Streak Calculations
// ==========================================

export const calculateStreak = (activityDates: Date[]): number => {
    if (activityDates.length === 0) return 0;

    const sortedDates = activityDates
        .map(d => new Date(d).setHours(0, 0, 0, 0))
        .sort((a, b) => b - a);

    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = today - 86400000;

    // Check if last activity was today or yesterday
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
        return 0;
    }

    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        const diff = sortedDates[i - 1] - sortedDates[i];
        if (diff === 86400000) {
            streak++;
        } else if (diff > 86400000) {
            break;
        }
    }

    return streak;
};

// ==========================================
// XP Calculations
// ==========================================

export const XP_REWARDS = {
    workout_complete: 50,
    goal_achieved: 100,
    streak_milestone: 75,
    first_workout_of_day: 25,
    personal_record: 150,
    meal_logged: 10,
    water_goal_met: 15,
};

export const calculateLevel = (totalXP: number): { level: number; currentXP: number; xpToNext: number } => {
    let level = 1;
    let xpNeeded = 100;
    let remainingXP = totalXP;

    while (remainingXP >= xpNeeded) {
        remainingXP -= xpNeeded;
        level++;
        xpNeeded = Math.floor(100 * Math.pow(1.5, level - 1));
    }

    return {
        level,
        currentXP: remainingXP,
        xpToNext: xpNeeded,
    };
};

// ==========================================
// Color Utilities
// ==========================================

export const getWorkoutTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        running: '#EF4444',
        cycling: '#F59E0B',
        weightlifting: '#8B5CF6',
        yoga: '#10B981',
        swimming: '#06B6D4',
        hiit: '#EC4899',
        cardio: '#F97316',
        strength: '#6366F1',
        flexibility: '#14B8A6',
        sports: '#84CC16',
        walking: '#22C55E',
        custom: '#6B7280',
    };
    return colors[type] || colors.custom;
};

export const getWorkoutTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
        running: '🏃',
        cycling: '🚴',
        weightlifting: '🏋️',
        yoga: '🧘',
        swimming: '🏊',
        hiit: '⚡',
        cardio: '❤️',
        strength: '💪',
        flexibility: '🤸',
        sports: '⚽',
        walking: '🚶',
        custom: '🎯',
    };
    return icons[type] || icons.custom;
};

// ==========================================
// Validation Utilities
// ==========================================

export const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const isValidWeight = (weight: number): boolean => {
    return weight > 0 && weight < 500;
};

export const isValidHeight = (height: number): boolean => {
    return height > 0 && height < 300;
};

export const isValidAge = (age: number): boolean => {
    return age > 0 && age < 150;
};

// ==========================================
// Array Utilities
// ==========================================

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
        const group = String(item[key]);
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {} as Record<string, T[]>);
};

export const sortByDate = <T extends { date: Date }>(array: T[], ascending = false): T[] => {
    return [...array].sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return ascending ? diff : -diff;
    });
};

// ==========================================
// Local Storage Utilities  
// ==========================================

export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    remove: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },
};

// ==========================================
// Debounce Utility
// ==========================================

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// ==========================================
// Class Name Utility
// ==========================================

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
    return classes.filter(Boolean).join(' ');
};
