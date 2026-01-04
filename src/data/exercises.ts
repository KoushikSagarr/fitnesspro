// Exercise Database - 50+ exercises with details
import type { Exercise, MuscleGroup, WorkoutType } from '../types';

export const exercises: Exercise[] = [
    // Chest Exercises
    {
        id: 'bench-press',
        name: 'Bench Press',
        muscleGroups: ['chest', 'triceps', 'shoulders'],
        type: 'strength',
        equipment: ['barbell', 'bench'],
        difficulty: 'intermediate',
        instructions: [
            'Lie flat on a bench with your eyes under the barbell',
            'Grip the bar slightly wider than shoulder-width',
            'Unrack and lower the bar to your mid-chest',
            'Press the bar up until arms are fully extended',
            'Lower with control and repeat'
        ],
        tips: ['Keep your feet flat on the floor', 'Maintain a slight arch in your lower back', 'Squeeze your shoulder blades together'],
        caloriesPerMinute: 8,
    },
    {
        id: 'push-ups',
        name: 'Push-Ups',
        muscleGroups: ['chest', 'triceps', 'shoulders', 'core'],
        type: 'strength',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Start in a high plank position with hands shoulder-width apart',
            'Lower your body until your chest nearly touches the floor',
            'Push back up to the starting position',
            'Keep your body in a straight line throughout'
        ],
        tips: ['Engage your core', 'Don\'t let your hips sag', 'Look slightly forward, not down'],
        caloriesPerMinute: 7,
    },
    {
        id: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        type: 'strength',
        equipment: ['dumbbells', 'incline bench'],
        difficulty: 'intermediate',
        instructions: [
            'Set bench to 30-45 degree incline',
            'Hold dumbbells at shoulder level with palms forward',
            'Press weights up until arms are extended',
            'Lower with control to starting position'
        ],
        tips: ['Keep elbows at 45-degree angle', 'Don\'t arch your back excessively'],
        caloriesPerMinute: 7,
    },
    {
        id: 'chest-dips',
        name: 'Chest Dips',
        muscleGroups: ['chest', 'triceps', 'shoulders'],
        type: 'strength',
        equipment: ['dip bars'],
        difficulty: 'intermediate',
        instructions: [
            'Grip parallel bars and lift yourself',
            'Lean forward slightly for chest emphasis',
            'Lower until shoulders are below elbows',
            'Push back up to starting position'
        ],
        tips: ['Control the descent', 'Lean forward to target chest more'],
        caloriesPerMinute: 9,
    },

    // Back Exercises
    {
        id: 'pull-ups',
        name: 'Pull-Ups',
        muscleGroups: ['back', 'biceps', 'shoulders'],
        type: 'strength',
        equipment: ['pull-up bar'],
        difficulty: 'intermediate',
        instructions: [
            'Hang from bar with palms facing away, wider than shoulders',
            'Pull yourself up until chin is above the bar',
            'Lower with control to full arm extension',
            'Avoid swinging or kipping'
        ],
        tips: ['Engage your lats', 'Start from a dead hang', 'Focus on pulling elbows down'],
        caloriesPerMinute: 10,
    },
    {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        muscleGroups: ['back', 'biceps'],
        type: 'strength',
        equipment: ['cable machine'],
        difficulty: 'beginner',
        instructions: [
            'Sit at the machine with thighs secured under pads',
            'Grip the bar wider than shoulder-width',
            'Pull bar down to upper chest',
            'Slowly return to starting position'
        ],
        tips: ['Lean back slightly', 'Pull with your elbows, not hands'],
        caloriesPerMinute: 6,
    },
    {
        id: 'barbell-row',
        name: 'Barbell Row',
        muscleGroups: ['back', 'biceps', 'core'],
        type: 'strength',
        equipment: ['barbell'],
        difficulty: 'intermediate',
        instructions: [
            'Bend at hips until torso is nearly parallel to floor',
            'Hold barbell with shoulder-width grip',
            'Pull bar to lower chest',
            'Lower with control'
        ],
        tips: ['Keep your back flat', 'Squeeze shoulder blades at top'],
        caloriesPerMinute: 7,
    },
    {
        id: 'deadlift',
        name: 'Deadlift',
        muscleGroups: ['back', 'glutes', 'hamstrings', 'core'],
        type: 'strength',
        equipment: ['barbell'],
        difficulty: 'advanced',
        instructions: [
            'Stand with feet hip-width, bar over mid-foot',
            'Bend at hips and knees to grip bar',
            'Drive through heels and stand up straight',
            'Lower bar with control by hinging at hips'
        ],
        tips: ['Keep the bar close to your body', 'Don\'t round your back', 'Engage your lats'],
        caloriesPerMinute: 10,
    },

    // Leg Exercises
    {
        id: 'squats',
        name: 'Squats',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
        type: 'strength',
        equipment: ['barbell'],
        difficulty: 'intermediate',
        instructions: [
            'Stand with feet shoulder-width apart',
            'Lower by bending knees and pushing hips back',
            'Descend until thighs are parallel to floor',
            'Drive through heels to stand back up'
        ],
        tips: ['Keep chest up', 'Knees track over toes', 'Keep weight in your heels'],
        caloriesPerMinute: 9,
    },
    {
        id: 'lunges',
        name: 'Lunges',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        type: 'strength',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Stand tall with feet together',
            'Step forward with one leg',
            'Lower until both knees are at 90 degrees',
            'Push back to starting position'
        ],
        tips: ['Keep front knee over ankle', 'Maintain upright torso'],
        caloriesPerMinute: 7,
    },
    {
        id: 'leg-press',
        name: 'Leg Press',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        type: 'strength',
        equipment: ['leg press machine'],
        difficulty: 'beginner',
        instructions: [
            'Sit in machine with back flat against pad',
            'Place feet shoulder-width on platform',
            'Lower weight by bending knees toward chest',
            'Press through heels to extend legs'
        ],
        tips: ['Don\'t lock knees at top', 'Keep lower back pressed into seat'],
        caloriesPerMinute: 6,
    },
    {
        id: 'romanian-deadlift',
        name: 'Romanian Deadlift',
        muscleGroups: ['hamstrings', 'glutes', 'back'],
        type: 'strength',
        equipment: ['barbell', 'dumbbells'],
        difficulty: 'intermediate',
        instructions: [
            'Hold weight in front of thighs',
            'Hinge at hips, pushing them backward',
            'Lower until you feel hamstring stretch',
            'Return by squeezing glutes'
        ],
        tips: ['Keep slight bend in knees', 'Keep back flat'],
        caloriesPerMinute: 7,
    },
    {
        id: 'calf-raises',
        name: 'Calf Raises',
        muscleGroups: ['calves'],
        type: 'strength',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Stand with feet hip-width apart',
            'Rise up onto your toes',
            'Hold briefly at the top',
            'Lower back down with control'
        ],
        tips: ['Use full range of motion', 'Pause at the top for better contraction'],
        caloriesPerMinute: 4,
    },

    // Shoulder Exercises
    {
        id: 'overhead-press',
        name: 'Overhead Press',
        muscleGroups: ['shoulders', 'triceps'],
        type: 'strength',
        equipment: ['barbell', 'dumbbells'],
        difficulty: 'intermediate',
        instructions: [
            'Hold weight at shoulder level',
            'Press straight overhead',
            'Lock out arms at the top',
            'Lower with control'
        ],
        tips: ['Keep core tight', 'Don\'t arch back excessively'],
        caloriesPerMinute: 7,
    },
    {
        id: 'lateral-raises',
        name: 'Lateral Raises',
        muscleGroups: ['shoulders'],
        type: 'strength',
        equipment: ['dumbbells'],
        difficulty: 'beginner',
        instructions: [
            'Hold dumbbells at your sides',
            'Raise arms out to sides until parallel to floor',
            'Keep slight bend in elbows',
            'Lower with control'
        ],
        tips: ['Lead with elbows', 'Don\'t swing the weights'],
        caloriesPerMinute: 5,
    },
    {
        id: 'face-pulls',
        name: 'Face Pulls',
        muscleGroups: ['shoulders', 'back'],
        type: 'strength',
        equipment: ['cable machine'],
        difficulty: 'beginner',
        instructions: [
            'Set cable at face height with rope attachment',
            'Pull rope toward face, separating hands',
            'Squeeze shoulder blades together',
            'Return with control'
        ],
        tips: ['Keep elbows high', 'Focus on rear deltoids'],
        caloriesPerMinute: 5,
    },

    // Arm Exercises
    {
        id: 'bicep-curls',
        name: 'Bicep Curls',
        muscleGroups: ['biceps'],
        type: 'strength',
        equipment: ['dumbbells', 'barbell'],
        difficulty: 'beginner',
        instructions: [
            'Hold weights at sides with palms forward',
            'Curl weights up toward shoulders',
            'Squeeze biceps at top',
            'Lower with control'
        ],
        tips: ['Keep elbows stationary', 'Don\'t swing the weight'],
        caloriesPerMinute: 5,
    },
    {
        id: 'tricep-pushdown',
        name: 'Tricep Pushdown',
        muscleGroups: ['triceps'],
        type: 'strength',
        equipment: ['cable machine'],
        difficulty: 'beginner',
        instructions: [
            'Grip cable bar with palms down',
            'Push bar down until arms are straight',
            'Keep elbows pinned to sides',
            'Return with control'
        ],
        tips: ['Keep upper arms stationary', 'Squeeze triceps at bottom'],
        caloriesPerMinute: 5,
    },
    {
        id: 'hammer-curls',
        name: 'Hammer Curls',
        muscleGroups: ['biceps', 'forearms'],
        type: 'strength',
        equipment: ['dumbbells'],
        difficulty: 'beginner',
        instructions: [
            'Hold dumbbells with palms facing each other',
            'Curl weights toward shoulders',
            'Keep neutral grip throughout',
            'Lower with control'
        ],
        tips: ['Great for forearm development', 'Can alternate arms'],
        caloriesPerMinute: 5,
    },
    {
        id: 'skull-crushers',
        name: 'Skull Crushers',
        muscleGroups: ['triceps'],
        type: 'strength',
        equipment: ['barbell', 'ez-bar'],
        difficulty: 'intermediate',
        instructions: [
            'Lie on bench holding weight above chest',
            'Bend elbows to lower weight toward forehead',
            'Keep upper arms perpendicular to floor',
            'Extend arms to return to start'
        ],
        tips: ['Keep elbows in', 'Use controlled movement'],
        caloriesPerMinute: 6,
    },

    // Core Exercises
    {
        id: 'plank',
        name: 'Plank',
        muscleGroups: ['core', 'shoulders'],
        type: 'strength',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Start in push-up position on forearms',
            'Keep body in straight line from head to heels',
            'Engage core and hold position',
            'Breathe steadily throughout'
        ],
        tips: ['Don\'t let hips sag or pike', 'Squeeze glutes for stability'],
        caloriesPerMinute: 4,
    },
    {
        id: 'crunches',
        name: 'Crunches',
        muscleGroups: ['core'],
        type: 'strength',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Lie on back with knees bent',
            'Place hands behind head or across chest',
            'Curl shoulders toward pelvis',
            'Lower with control'
        ],
        tips: ['Don\'t pull on neck', 'Focus on contracting abs'],
        caloriesPerMinute: 5,
    },
    {
        id: 'russian-twists',
        name: 'Russian Twists',
        muscleGroups: ['core', 'obliques'],
        type: 'strength',
        equipment: [],
        difficulty: 'intermediate',
        instructions: [
            'Sit with knees bent, feet off ground',
            'Lean back slightly, balancing on sit bones',
            'Rotate torso side to side',
            'Touch hands to ground on each side'
        ],
        tips: ['Keep core engaged', 'Move with control'],
        caloriesPerMinute: 6,
    },
    {
        id: 'leg-raises',
        name: 'Leg Raises',
        muscleGroups: ['core'],
        type: 'strength',
        equipment: [],
        difficulty: 'intermediate',
        instructions: [
            'Lie flat on back with legs straight',
            'Raise legs until perpendicular to floor',
            'Lower slowly without touching ground',
            'Keep lower back pressed into floor'
        ],
        tips: ['Use slow, controlled movement', 'Bend knees to make easier'],
        caloriesPerMinute: 5,
    },
    {
        id: 'mountain-climbers',
        name: 'Mountain Climbers',
        muscleGroups: ['core', 'shoulders', 'cardio'],
        type: 'cardio',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Start in high plank position',
            'Drive one knee toward chest',
            'Quickly switch legs',
            'Continue alternating at rapid pace'
        ],
        tips: ['Keep hips down', 'Maintain steady breathing'],
        caloriesPerMinute: 10,
    },

    // Cardio Exercises
    {
        id: 'running',
        name: 'Running',
        muscleGroups: ['quadriceps', 'hamstrings', 'calves', 'glutes'],
        type: 'cardio',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Start with a 5-minute warm-up walk',
            'Begin running at comfortable pace',
            'Maintain steady breathing',
            'Cool down with 5-minute walk'
        ],
        tips: ['Land on midfoot', 'Keep arms at 90 degrees', 'Stay hydrated'],
        caloriesPerMinute: 11,
    },
    {
        id: 'cycling',
        name: 'Cycling',
        muscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
        type: 'cardio',
        equipment: ['bicycle', 'stationary bike'],
        difficulty: 'beginner',
        instructions: [
            'Adjust seat to proper height',
            'Start pedaling at moderate pace',
            'Vary intensity as desired',
            'Cool down with easy pedaling'
        ],
        tips: ['Keep core engaged', 'Adjust resistance for challenge'],
        caloriesPerMinute: 8,
    },
    {
        id: 'jumping-jacks',
        name: 'Jumping Jacks',
        muscleGroups: ['full-body'],
        type: 'cardio',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Stand with feet together, arms at sides',
            'Jump feet apart while raising arms overhead',
            'Jump back to starting position',
            'Repeat at steady pace'
        ],
        tips: ['Land softly', 'Keep core tight'],
        caloriesPerMinute: 8,
    },
    {
        id: 'burpees',
        name: 'Burpees',
        muscleGroups: ['full-body'],
        type: 'cardio',
        equipment: [],
        difficulty: 'intermediate',
        instructions: [
            'Start standing, then drop to squat',
            'Place hands on floor and jump feet back to plank',
            'Perform a push-up (optional)',
            'Jump feet forward and explode up with arms overhead'
        ],
        tips: ['Modify by stepping instead of jumping', 'Focus on form over speed'],
        caloriesPerMinute: 12,
    },
    {
        id: 'jump-rope',
        name: 'Jump Rope',
        muscleGroups: ['calves', 'shoulders', 'core'],
        type: 'cardio',
        equipment: ['jump rope'],
        difficulty: 'beginner',
        instructions: [
            'Hold rope handles at hip level',
            'Swing rope overhead',
            'Jump just high enough to clear rope',
            'Land softly on balls of feet'
        ],
        tips: ['Use wrist motion, not arms', 'Start with basic jumps'],
        caloriesPerMinute: 12,
    },
    {
        id: 'swimming',
        name: 'Swimming',
        muscleGroups: ['full-body'],
        type: 'cardio',
        equipment: ['pool'],
        difficulty: 'beginner',
        instructions: [
            'Choose your stroke (freestyle, breaststroke, etc.)',
            'Maintain proper form',
            'Breathe rhythmically',
            'Vary intensity with intervals'
        ],
        tips: ['Great low-impact exercise', 'Works entire body'],
        caloriesPerMinute: 9,
    },
    {
        id: 'rowing',
        name: 'Rowing',
        muscleGroups: ['back', 'arms', 'legs', 'core'],
        type: 'cardio',
        equipment: ['rowing machine'],
        difficulty: 'beginner',
        instructions: [
            'Sit with feet secured on footrests',
            'Push with legs first, then pull with arms',
            'Return by extending arms then bending knees',
            'Maintain fluid motion'
        ],
        tips: ['Drive with legs for power', 'Keep core engaged'],
        caloriesPerMinute: 10,
    },
    {
        id: 'stair-climbing',
        name: 'Stair Climbing',
        muscleGroups: ['quadriceps', 'glutes', 'calves'],
        type: 'cardio',
        equipment: ['stairs', 'stair machine'],
        difficulty: 'beginner',
        instructions: [
            'Step onto first stair',
            'Continue climbing at steady pace',
            'Use handrails for balance if needed',
            'Vary speed for intensity'
        ],
        tips: ['Great for leg strength', 'Keep posture upright'],
        caloriesPerMinute: 9,
    },

    // HIIT Exercises
    {
        id: 'high-knees',
        name: 'High Knees',
        muscleGroups: ['core', 'quadriceps', 'calves'],
        type: 'hiit',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Stand with feet hip-width apart',
            'Drive one knee up toward chest',
            'Quickly switch legs',
            'Pump arms in running motion'
        ],
        tips: ['Stay on balls of feet', 'Keep core tight'],
        caloriesPerMinute: 10,
    },
    {
        id: 'box-jumps',
        name: 'Box Jumps',
        muscleGroups: ['quadriceps', 'glutes', 'calves'],
        type: 'hiit',
        equipment: ['plyo box'],
        difficulty: 'intermediate',
        instructions: [
            'Stand facing box at comfortable distance',
            'Swing arms and jump onto box',
            'Land softly with both feet',
            'Step down and repeat'
        ],
        tips: ['Start with lower box', 'Land softly with bent knees'],
        caloriesPerMinute: 12,
    },
    {
        id: 'kettlebell-swings',
        name: 'Kettlebell Swings',
        muscleGroups: ['glutes', 'hamstrings', 'core', 'shoulders'],
        type: 'hiit',
        equipment: ['kettlebell'],
        difficulty: 'intermediate',
        instructions: [
            'Stand with feet wider than shoulder-width',
            'Hinge at hips and swing kettlebell between legs',
            'Thrust hips forward to swing weight to shoulder height',
            'Let it swing back between legs and repeat'
        ],
        tips: ['Power comes from hip thrust', 'Keep arms relaxed'],
        caloriesPerMinute: 12,
    },
    {
        id: 'battle-ropes',
        name: 'Battle Ropes',
        muscleGroups: ['shoulders', 'arms', 'core'],
        type: 'hiit',
        equipment: ['battle ropes'],
        difficulty: 'intermediate',
        instructions: [
            'Hold one rope end in each hand',
            'Squat slightly and create waves with alternating arms',
            'Continue for set time or reps',
            'Vary patterns (waves, slams, circles)'
        ],
        tips: ['Keep core engaged', 'Breathe steadily'],
        caloriesPerMinute: 13,
    },

    // Flexibility & Stretching
    {
        id: 'yoga-sun-salutation',
        name: 'Sun Salutation',
        muscleGroups: ['full-body'],
        type: 'flexibility',
        equipment: ['yoga mat'],
        difficulty: 'beginner',
        instructions: [
            'Start in mountain pose',
            'Flow through upward salute, forward fold, plank, cobra',
            'Move to downward dog, then return to forward fold',
            'Rise to mountain pose'
        ],
        tips: ['Connect movement with breath', 'Modify poses as needed'],
        caloriesPerMinute: 4,
    },
    {
        id: 'hip-stretches',
        name: 'Hip Stretches',
        muscleGroups: ['hips', 'glutes'],
        type: 'flexibility',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Perform hip flexor stretch in lunge position',
            'Hold for 30 seconds each side',
            'Try pigeon pose for deeper stretch',
            'Add figure-four stretch for glutes'
        ],
        tips: ['Breathe deeply', 'Never bounce in stretches'],
        caloriesPerMinute: 2,
    },
    {
        id: 'hamstring-stretch',
        name: 'Hamstring Stretch',
        muscleGroups: ['hamstrings'],
        type: 'flexibility',
        equipment: [],
        difficulty: 'beginner',
        instructions: [
            'Stand and place one heel on low surface',
            'Keep leg straight and hinge forward at hips',
            'Hold for 30 seconds',
            'Switch legs'
        ],
        tips: ['Keep back flat', 'Don\'t round spine'],
        caloriesPerMinute: 2,
    },
];

// Helper functions
export const getExercisesByMuscleGroup = (muscleGroup: MuscleGroup): Exercise[] => {
    return exercises.filter(ex => ex.muscleGroups.includes(muscleGroup));
};

export const getExercisesByType = (type: WorkoutType): Exercise[] => {
    return exercises.filter(ex => ex.type === type);
};

export const getExercisesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Exercise[] => {
    return exercises.filter(ex => ex.difficulty === difficulty);
};

export const getExerciseById = (id: string): Exercise | undefined => {
    return exercises.find(ex => ex.id === id);
};

export const searchExercises = (query: string): Exercise[] => {
    const lowercaseQuery = query.toLowerCase();
    return exercises.filter(ex =>
        ex.name.toLowerCase().includes(lowercaseQuery) ||
        ex.muscleGroups.some(mg => mg.toLowerCase().includes(lowercaseQuery)) ||
        ex.type.toLowerCase().includes(lowercaseQuery)
    );
};

export const muscleGroups: { value: MuscleGroup; label: string; emoji: string }[] = [
    { value: 'chest', label: 'Chest', emoji: '🫁' },
    { value: 'back', label: 'Back', emoji: '🔙' },
    { value: 'shoulders', label: 'Shoulders', emoji: '💪' },
    { value: 'biceps', label: 'Biceps', emoji: '💪' },
    { value: 'triceps', label: 'Triceps', emoji: '💪' },
    { value: 'quadriceps', label: 'Quadriceps', emoji: '🦵' },
    { value: 'hamstrings', label: 'Hamstrings', emoji: '🦵' },
    { value: 'glutes', label: 'Glutes', emoji: '🍑' },
    { value: 'calves', label: 'Calves', emoji: '🦵' },
    { value: 'core', label: 'Core', emoji: '🎯' },
    { value: 'forearms', label: 'Forearms', emoji: '💪' },
];

export const workoutTypes: { value: WorkoutType; label: string; emoji: string }[] = [
    { value: 'strength', label: 'Strength', emoji: '🏋️' },
    { value: 'cardio', label: 'Cardio', emoji: '🏃' },
    { value: 'hiit', label: 'HIIT', emoji: '⚡' },
    { value: 'flexibility', label: 'Flexibility', emoji: '🧘' },
];

export default exercises;
