# 💪 FitTrack Pro

A modern, feature-rich fitness tracking web application built with React, TypeScript, and Firebase.

![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.1-FFCA28?logo=firebase)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)

## ✨ Features

### 🏋️ Workout Tracking
- Log workouts with exercise details, sets, reps, and weights
- Track duration and calories burned
- View workout history and statistics

### 🍎 Nutrition Tracking
- Log meals (breakfast, lunch, dinner, snacks)
- Track macros: calories, protein, carbs, and fat
- Monitor daily water intake

### 📊 Progress Analytics
- Visualize your progress with interactive charts
- Weekly and monthly statistics
- Track weight changes over time

### 🎯 Goal Setting
- Set customizable fitness goals
- Track daily, weekly, and monthly targets
- Progress indicators for each goal

### 🏆 Achievements & Gamification
- Earn XP for completing workouts
- Level up system
- Unlock achievements and badges
- Maintain workout streaks

### 👤 User Features
- Secure authentication (Email/Password + Google)
- Personalized onboarding
- Custom user profiles
- Dark/Light theme support

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript |
| Styling | Vanilla CSS with CSS Variables |
| Build Tool | Vite |
| Backend | Firebase (Auth + Firestore) |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fitnesspro.git
   cd fitnesspro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id"
   ```

4. **Set up Firestore Security Rules**
   
   In Firebase Console → Firestore → Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /workouts/{workoutId} {
         allow read, write: if request.auth != null;
       }
       match /meals/{mealId} {
         allow read, write: if request.auth != null;
       }
       match /goals/{goalId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Sidebar, navigation
│   ├── ui/             # Button, Card, ProgressRing
│   └── workout/        # Workout-specific components
├── contexts/           # React Context (User, Theme)
├── data/               # Static data and mocks
├── pages/              # Page components
│   ├── AuthPage        # Login/Signup
│   ├── DashboardPage   # Main dashboard
│   ├── WorkoutsPage    # Workout management
│   ├── NutritionPage   # Meal tracking
│   ├── GoalsPage       # Goal setting
│   ├── ProgressPage    # Analytics
│   ├── AchievementsPage # Gamification
│   ├── ProfilePage     # User profile
│   └── SettingsPage    # App settings
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
├── App.tsx             # Root component
├── App.css             # Global styles
└── firebase.ts         # Firebase configuration
```

## 🎨 Design System

The app uses a custom CSS design system with:
- **CSS Variables** for theming
- **Dark mode** as default with light mode support
- **Glassmorphism** effects
- **Smooth animations** with Framer Motion
- **Responsive design** (mobile-first)

## 📱 Future Roadmap

- [ ] PWA support for mobile installation
- [ ] Google Fit / Apple Health integration
- [ ] AI-powered workout recommendations
- [ ] Social features (friends, challenges)
- [ ] Workout timer with rest intervals
- [ ] Export data as CSV/PDF
- [ ] React Native mobile app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ for fitness enthusiasts
