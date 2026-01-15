// ==========================================
// FitTrack Pro - Type Definitions
// ==========================================

// User Types
export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    weight: number; // kg
    height: number; // cm
    age: number;
    gender: 'male' | 'female' | 'other';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goalType: 'lose_weight' | 'maintain' | 'build_muscle';
    targetWeight?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Workout Types
export interface Workout {
    id: string;
    userId: string;
    type: WorkoutType;
    name: string;
    duration: number; // minutes
    calories: number;
    exercises?: WorkoutExercise[];
    notes?: string;
    date: Date;
    createdAt: Date;
}

export type WorkoutType =
    | 'running'
    | 'cycling'
    | 'weightlifting'
    | 'yoga'
    | 'swimming'
    | 'hiit'
    | 'cardio'
    | 'strength'
    | 'flexibility'
    | 'sports'
    | 'walking'
    | 'custom';

export interface WorkoutExercise {
    exerciseId: string;
    name: string;
    sets?: number;
    reps?: number;
    weight?: number; // kg
    duration?: number; // seconds
    restTime?: number; // seconds
    completed: boolean;
}

// Exercise Library Types
export interface Exercise {
    id: string;
    name: string;
    type: WorkoutType;
    category?: ExerciseCategory;
    muscleGroups: MuscleGroup[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    equipment: string[];
    instructions: string[];
    tips?: string[];
    caloriesPerMinute: number;
    imageUrl?: string;
    videoUrl?: string;
}

export type ExerciseCategory =
    | 'strength'
    | 'cardio'
    | 'flexibility'
    | 'balance'
    | 'plyometric';

export type MuscleGroup =
    | 'chest'
    | 'back'
    | 'shoulders'
    | 'biceps'
    | 'triceps'
    | 'forearms'
    | 'arms'
    | 'core'
    | 'obliques'
    | 'quadriceps'
    | 'hamstrings'
    | 'glutes'
    | 'hips'
    | 'legs'
    | 'calves'
    | 'full-body'
    | 'cardio';

// Goal Types
export interface Goal {
    id: string;
    userId: string;
    type: GoalType;
    target: number;
    current: number;
    unit: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    createdAt: Date;
}

export type GoalType =
    | 'steps'
    | 'calories_burned'
    | 'workouts'
    | 'water_intake'
    | 'weight'
    | 'workout_minutes'
    | 'distance';

// Nutrition Types
export interface Meal {
    id: string;
    userId: string;
    name: string;
    type: MealType;
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
    fiber?: number;
    sugar?: number;
    sodium?: number;
    date: Date;
    createdAt: Date;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface WaterIntake {
    id: string;
    userId: string;
    amount: number; // ml
    date: Date;
}

export interface DailyNutrition {
    date: Date;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    waterIntake: number;
    meals: Meal[];
}

// Achievement Types
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: AchievementCategory;
    requirement: number;
    xpReward: number;
}

export interface UserAchievement {
    id: string;
    odId: string;
    userId: string;
    achievementId: string;
    unlockedAt: Date;
    progress: number;
}

export type AchievementCategory =
    | 'workout'
    | 'streak'
    | 'nutrition'
    | 'milestone'
    | 'special';

// Stats & Analytics Types
export interface DailyStats {
    date: Date;
    userId: string;
    steps: number;
    caloriesBurned: number;
    caloriesConsumed: number;
    workoutsCompleted: number;
    workoutMinutes: number;
    waterIntake: number;
    weight?: number;
}

export interface WeeklyStats {
    weekStart: Date;
    weekEnd: Date;
    totalWorkouts: number;
    totalCaloriesBurned: number;
    totalWorkoutMinutes: number;
    avgDailySteps: number;
    streak: number;
}

// UI Types
export interface NavigationItem {
    id: string;
    label: string;
    icon: string;
    path: string;
    badge?: number;
}

export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}

// Theme Types
export type ThemeMode = 'dark' | 'light';

export interface Theme {
    mode: ThemeMode;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        success: string;
        warning: string;
        error: string;
    };
}

// Workout Plan Types
export interface WorkoutPlan {
    id: string;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number; // weeks
    daysPerWeek: number;
    exercises: WorkoutPlanDay[];
    category: WorkoutType;
    imageUrl?: string;
    createdBy: string;
    isPublic: boolean;
}

export interface WorkoutPlanDay {
    dayNumber: number;
    name: string;
    exercises: WorkoutExercise[];
    restDay: boolean;
}

// Streak Types
export interface Streak {
    current: number;
    longest: number;
    lastActivityDate: Date;
}

// XP & Level Types
export interface UserProgress {
    level: number;
    currentXP: number;
    totalXP: number;
    xpToNextLevel: number;
}

// Form Types
export interface WorkoutFormData {
    type: WorkoutType;
    name: string;
    duration: number;
    exercises: WorkoutExercise[];
    notes?: string;
}

export interface MealFormData {
    name: string;
    type: MealType;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface GoalFormData {
    type: GoalType;
    target: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
}

// Strava Integration Types
export interface StravaTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    athleteId: number;
    connectedAt: Date;
}

export interface StravaActivity {
    id: number;
    name: string;
    type: string;
    sport_type: string;
    start_date: string;
    elapsed_time: number; // seconds
    moving_time: number; // seconds
    distance: number; // meters
    total_elevation_gain: number;
    average_speed: number;
    max_speed: number;
    average_heartrate?: number;
    max_heartrate?: number;
    calories?: number;
}

export interface ConnectedApp {
    id: string;
    name: string;
    icon: string;
    connected: boolean;
    lastSync?: Date;
    athleteName?: string;
}

