import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase';

interface Workout {
  id: string;
  type: string;
  duration: number;
  calories: number;
  steps?: number;
  date: any;
}

const WorkoutHistory: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.currentUser) {
      setError('You must be logged in to view your workout history.');
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedWorkouts: Workout[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedWorkouts.push({
          id: doc.id,
          type: data.type,
          duration: data.duration,
          calories: data.calories,
          steps: data.steps || 0,
          date: data.date,
        });
      });
      fetchedWorkouts.sort((a, b) => b.date.toMillis() - a.date.toMillis());
      setWorkouts(fetchedWorkouts);
      setIsLoading(false);
    }, (err) => {
      setError('Failed to fetch workouts: ' + err.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <p className="loading-message">Loading workout history...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (workouts.length === 0) {
    return <p className="no-data-message">No workouts logged yet. Add one above!</p>;
  }

  return (
    <div className="workout-history-container">
      <h4 className="section-title">Workout History</h4>
      <div className="history-list">
        {workouts.map((workout) => (
          <div key={workout.id} className="history-item">
            <div className="item-icon">💪</div>
            <div className="item-details" style={{ flexGrow: 1 }}>
              <p className="item-title">{workout.type}</p>
              <p className="item-subtitle">
                {workout.duration} minutes • {workout.calories} kcal
                {workout.steps && ` • ${workout.steps} steps`}
              </p>
            </div>
            <p className="item-date">
              {workout.date.toDate().toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutHistory;
