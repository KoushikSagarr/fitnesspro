import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { UserProfile, Streak, UserProgress } from '../types';

interface UserContextType {
    user: User | null;
    userProfile: UserProfile | null;
    streak: Streak;
    progress: UserProgress;
    isLoading: boolean;
    isProfileComplete: boolean;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    logout: () => Promise<void>;
    addXP: (amount: number) => Promise<void>;
}

const defaultStreak: Streak = {
    current: 0,
    longest: 0,
    lastActivityDate: new Date(),
};

const defaultProgress: UserProgress = {
    level: 1,
    currentXP: 0,
    totalXP: 0,
    xpToNextLevel: 100,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [streak, setStreak] = useState<Streak>(defaultStreak);
    const [progress, setProgress] = useState<UserProgress>(defaultProgress);
    const [isLoading, setIsLoading] = useState(true);

    // Calculate XP needed for next level (increases with level)
    const calculateXPForLevel = (level: number): number => {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Set up real-time listener for user profile
                const userDocRef = doc(db, 'users', currentUser.uid);
                const unsubProfile = onSnapshot(
                    userDocRef,
                    (docSnap) => {
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            setUserProfile({
                                uid: currentUser.uid,
                                email: currentUser.email || '',
                                displayName: data.displayName || currentUser.displayName,
                                photoURL: data.photoURL || currentUser.photoURL,
                                weight: data.weight,
                                height: data.height,
                                age: data.age,
                                gender: data.gender,
                                activityLevel: data.activityLevel || 'moderate',
                                goalType: data.goalType || 'maintain',
                                targetWeight: data.targetWeight,
                                createdAt: data.createdAt?.toDate() || new Date(),
                                updatedAt: data.updatedAt?.toDate() || new Date(),
                            });

                            // Set streak data
                            if (data.streak) {
                                setStreak({
                                    current: data.streak.current || 0,
                                    longest: data.streak.longest || 0,
                                    lastActivityDate: data.streak.lastActivityDate?.toDate() || new Date(),
                                });
                            }

                            // Set progress data
                            if (data.progress) {
                                setProgress({
                                    level: data.progress.level || 1,
                                    currentXP: data.progress.currentXP || 0,
                                    totalXP: data.progress.totalXP || 0,
                                    xpToNextLevel: calculateXPForLevel(data.progress.level || 1),
                                });
                            }
                        } else {
                            // User document doesn't exist yet (new user)
                            setUserProfile(null);
                        }
                        setIsLoading(false);
                    },
                    (error) => {
                        // Handle Firestore errors (permission denied, etc.)
                        console.error('Firestore listener error:', error);
                        setUserProfile(null);
                        setIsLoading(false);
                    }
                );

                return () => unsubProfile();
            } else {
                setUserProfile(null);
                setStreak(defaultStreak);
                setProgress(defaultProgress);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
        if (!user) throw new Error('No user logged in');

        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
            ...data,
            updatedAt: new Date(),
        }, { merge: true });
    };

    const logout = async (): Promise<void> => {
        await signOut(auth);
        setUser(null);
        setUserProfile(null);
    };

    const addXP = async (amount: number): Promise<void> => {
        if (!user) return;

        let newCurrentXP = progress.currentXP + amount;
        let newLevel = progress.level;
        let newTotalXP = progress.totalXP + amount;
        let xpNeeded = calculateXPForLevel(newLevel);

        // Level up loop
        while (newCurrentXP >= xpNeeded) {
            newCurrentXP -= xpNeeded;
            newLevel++;
            xpNeeded = calculateXPForLevel(newLevel);
        }

        const newProgress = {
            level: newLevel,
            currentXP: newCurrentXP,
            totalXP: newTotalXP,
            xpToNextLevel: xpNeeded,
        };

        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { progress: newProgress }, { merge: true });
        setProgress(newProgress);
    };

    const isProfileComplete = userProfile !== null &&
        userProfile.weight > 0 &&
        userProfile.height > 0 &&
        userProfile.age > 0;

    const value: UserContextType = {
        user,
        userProfile,
        streak,
        progress,
        isLoading,
        isProfileComplete,
        updateProfile,
        logout,
        addXP,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
