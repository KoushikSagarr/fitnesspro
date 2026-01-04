import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, User, Target, Activity, Sparkles } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { auth, db } from '../firebase';
import { Button } from '../components/ui';
import './OnboardingPage.css';

interface OnboardingData {
    displayName: string;
    weight: string;
    height: string;
    age: string;
    gender: 'male' | 'female' | 'other';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goalType: 'lose_weight' | 'maintain' | 'build_muscle';
}

const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<OnboardingData>({
        displayName: auth.currentUser?.displayName || '',
        weight: '',
        height: '',
        age: '',
        gender: 'male',
        activityLevel: 'moderate',
        goalType: 'maintain',
    });

    const steps = [
        { title: 'Personal Info', icon: User },
        { title: 'Body Metrics', icon: Activity },
        { title: 'Your Goal', icon: Target },
        { title: 'Get Started', icon: Sparkles },
    ];

    const updateData = (field: keyof OnboardingData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const canProceed = () => {
        switch (step) {
            case 0:
                return data.displayName.trim().length >= 2;
            case 1:
                return data.weight && data.height && data.age &&
                    parseInt(data.weight) > 0 &&
                    parseInt(data.height) > 0 &&
                    parseInt(data.age) > 0;
            case 2:
                return true;
            default:
                return true;
        }
    };

    const handleComplete = async () => {
        if (!auth.currentUser) return;
        setIsLoading(true);

        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                email: auth.currentUser.email,
                displayName: data.displayName,
                weight: parseInt(data.weight),
                height: parseInt(data.height),
                age: parseInt(data.age),
                gender: data.gender,
                activityLevel: data.activityLevel,
                goalType: data.goalType,
                streak: { current: 0, longest: 0, lastActivityDate: new Date() },
                progress: { level: 1, currentXP: 0, totalXP: 0 },
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            toast.success('Profile created! Welcome to FitTrack Pro! 🎉');
            window.location.reload();
        } catch (error) {
            toast.error('Failed to save profile. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div className="step-content">
                        <h2>What should we call you?</h2>
                        <p>Let's personalize your experience</p>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={data.displayName}
                            onChange={(e) => updateData('displayName', e.target.value)}
                            className="onboarding-input"
                            autoFocus
                        />
                        <div className="gender-select">
                            <p className="select-label">Gender</p>
                            <div className="gender-options">
                                {['male', 'female', 'other'].map((g) => (
                                    <button
                                        key={g}
                                        className={`gender-option ${data.gender === g ? 'active' : ''}`}
                                        onClick={() => updateData('gender', g)}
                                    >
                                        {g === 'male' ? '👨' : g === 'female' ? '👩' : '🧑'}
                                        <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="step-content">
                        <h2>Your body metrics</h2>
                        <p>This helps us calculate accurate stats for you</p>
                        <div className="metrics-grid">
                            <div className="metric-input">
                                <label>Weight (kg)</label>
                                <input
                                    type="number"
                                    placeholder="70"
                                    value={data.weight}
                                    onChange={(e) => updateData('weight', e.target.value)}
                                    min="20"
                                    max="300"
                                />
                            </div>
                            <div className="metric-input">
                                <label>Height (cm)</label>
                                <input
                                    type="number"
                                    placeholder="175"
                                    value={data.height}
                                    onChange={(e) => updateData('height', e.target.value)}
                                    min="100"
                                    max="250"
                                />
                            </div>
                            <div className="metric-input">
                                <label>Age</label>
                                <input
                                    type="number"
                                    placeholder="25"
                                    value={data.age}
                                    onChange={(e) => updateData('age', e.target.value)}
                                    min="13"
                                    max="120"
                                />
                            </div>
                        </div>
                        <div className="activity-select">
                            <p className="select-label">Activity Level</p>
                            <div className="activity-options">
                                {[
                                    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                                    { value: 'light', label: 'Light', desc: '1-3 days/week' },
                                    { value: 'moderate', label: 'Moderate', desc: '3-5 days/week' },
                                    { value: 'active', label: 'Active', desc: '6-7 days/week' },
                                    { value: 'very_active', label: 'Very Active', desc: 'Athlete level' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        className={`activity-option ${data.activityLevel === option.value ? 'active' : ''}`}
                                        onClick={() => updateData('activityLevel', option.value)}
                                    >
                                        <span className="option-label">{option.label}</span>
                                        <span className="option-desc">{option.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="step-content">
                        <h2>What's your fitness goal?</h2>
                        <p>We'll customize your experience accordingly</p>
                        <div className="goal-options">
                            {[
                                { value: 'lose_weight', icon: '🔥', label: 'Lose Weight', desc: 'Burn fat and get lean' },
                                { value: 'maintain', icon: '⚖️', label: 'Stay Fit', desc: 'Maintain current weight' },
                                { value: 'build_muscle', icon: '💪', label: 'Build Muscle', desc: 'Gain strength and size' },
                            ].map((goal) => (
                                <button
                                    key={goal.value}
                                    className={`goal-option ${data.goalType === goal.value ? 'active' : ''}`}
                                    onClick={() => updateData('goalType', goal.value)}
                                >
                                    <span className="goal-icon">{goal.icon}</span>
                                    <div className="goal-text">
                                        <span className="goal-label">{goal.label}</span>
                                        <span className="goal-desc">{goal.desc}</span>
                                    </div>
                                    {data.goalType === goal.value && (
                                        <motion.div
                                            className="goal-check"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check size={16} />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="step-content final-step">
                        <motion.div
                            className="success-icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            🎉
                        </motion.div>
                        <h2>You're all set, {data.displayName}!</h2>
                        <p>Your personalized fitness journey awaits</p>
                        <div className="summary-card">
                            <div className="summary-item">
                                <span className="summary-label">Goal</span>
                                <span className="summary-value">
                                    {data.goalType === 'lose_weight' ? 'Lose Weight' :
                                        data.goalType === 'build_muscle' ? 'Build Muscle' : 'Stay Fit'}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Activity</span>
                                <span className="summary-value">{data.activityLevel.replace('_', ' ')}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Stats</span>
                                <span className="summary-value">{data.weight}kg • {data.height}cm • {data.age}y</span>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="onboarding-page">
            <div className="onboarding-container">
                {/* Progress Steps */}
                <div className="steps-indicator">
                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={i}
                                className={`step-dot ${i === step ? 'active' : i < step ? 'completed' : ''}`}
                            >
                                {i < step ? <Check size={14} /> : <Icon size={14} />}
                            </div>
                        );
                    })}
                    <div
                        className="steps-progress-bar"
                        style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="step-wrapper"
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="onboarding-nav">
                    {step > 0 && (
                        <Button
                            variant="ghost"
                            onClick={() => setStep(step - 1)}
                            leftIcon={<ChevronLeft size={18} />}
                        >
                            Back
                        </Button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < steps.length - 1 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            disabled={!canProceed()}
                            rightIcon={<ChevronRight size={18} />}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            onClick={handleComplete}
                            isLoading={isLoading}
                            rightIcon={<Sparkles size={18} />}
                        >
                            Start My Journey
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
