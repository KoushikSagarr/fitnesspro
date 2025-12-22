import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase';

interface UserProfileProps {
  user: any;
  onProfileComplete: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onProfileComplete }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!user || !weight || !height || !age || !gender) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        weight: parseInt(weight),
        height: parseInt(height),
        age: parseInt(age),
        gender: gender,
      });
      console.log('Profile saved successfully!');
      onProfileComplete();
    } catch (err: any) {
      setError('Error saving profile: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-profile-container">
      <h4 className="section-title">Complete Your Profile</h4>
      <p className="profile-subtitle">This data is required for accurate calorie tracking.</p>
      <form onSubmit={handleSaveProfile} className="profile-form">
        <div className="form-group">
          <label>Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UserProfile;
