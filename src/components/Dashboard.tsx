import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase';

import UserProfile from './UserProfile';
import WorkoutHistory from './WorkoutHistory';

interface DashboardProps {
  user: any;
}

const workoutTypes = [
  'Running',
  'Cycling',
  'Weightlifting',
  'Yoga',
  'Swimming',
];

const MET_VALUES: { [key: string]: number } = {
  'Running': 8.0,
  'Cycling': 7.5,
  'Weightlifting': 3.0,
  'Yoga': 2.5,
  'Swimming': 6.0,
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [workoutType, setWorkoutType] = useState(workoutTypes[0]);
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [todaySteps, setTodaySteps] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data());
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      }
      setIsCheckingProfile(false);
    };

    checkUserProfile();
  }, [user]);

  useEffect(() => {
    if (user) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', user.uid),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let totalCalories = 0;
        let totalSteps = 0; 
        querySnapshot.forEach((doc) => {
          const workout = doc.data();
          totalCalories += workout.calories;
          if (workout.steps) {
            totalSteps += workout.steps;
          }
        });
        setTodayCalories(totalCalories);
        setTodaySteps(totalSteps);
      });
      
      return () => unsubscribe();
    }
  }, [user]);

  const handleProfileComplete = () => {
    setHasProfile(true);
  };

  const calculateCalories = (workoutDuration: number, metValue: number, weight: number): number => {
    const caloriesPerMinute = (metValue * 3.5 * weight) / 200;
    return Math.round(caloriesPerMinute * workoutDuration);
  };

  const handleLogWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!auth.currentUser || !userProfile) {
      setError('User profile is missing. Please complete your profile first.');
      return;
    }

    const durationInMinutes = parseInt(duration);
    if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
      setError('Please enter a valid duration.');
      return;
    }

    const metValue = MET_VALUES[workoutType];
    const userWeight = userProfile.weight;
    const caloriesBurned = calculateCalories(durationInMinutes, metValue, userWeight);
    
    try {
      await addDoc(collection(db, 'workouts'), {
        userId: auth.currentUser.uid,
        type: workoutType,
        duration: durationInMinutes,
        calories: caloriesBurned,
        steps: Math.round(durationInMinutes * 100), // Placeholder steps
        date: new Date(),
      });
      alert('Workout logged successfully!');
      setDuration('');
    } catch (err: any) {
      setError('Error logging workout: ' + err.message);
    }
  };

  if (isCheckingProfile) {
    return <p>Checking user profile...</p>;
  }
  
  if (!hasProfile) {
    return <UserProfile user={user} onProfileComplete={handleProfileComplete} />;
  }

  return (
    <div className="dashboard-container">
      <div className="activity-summary" id="activity-summary">
        <h4 className="section-title">Your Activity Summary</h4>
        <div className="summary-card">
          <p className="summary-label">Today's Steps</p>
          <p className="summary-value">{todaySteps}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Calories Burned</p>
          <p className="summary-value">{todayCalories}</p>
        </div>
      </div>
      
      <div className="dashboard-options" id="stats">
        <h4 className="section-title">Quick Actions</h4>
        <div className="action-grid">
          <button className="action-card">
            <span className="card-icon">📈</span>
            <p className="card-label">View Stats</p>
          </button>
          <button className="action-card">
            <span className="card-icon">🗓️</span>
            <p className="card-label">Set Goals</p>
          </button>
        </div>
      </div>

      <div className="workout-form-section" id="log-workout">
        <h4 className="section-title">Log a New Workout</h4>
        <form onSubmit={handleLogWorkout} className="log-workout-form">
          <div className="form-group">
            <label>Workout Type</label>
            <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
              {workoutTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
            />
          </div>
          <button type="submit">Add Workout</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Dashboard;