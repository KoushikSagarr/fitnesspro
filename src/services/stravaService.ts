// ==========================================
// Strava API Integration Service
// ==========================================

import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { StravaTokens, StravaActivity, Workout } from '../types';

const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI;

const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_URL = 'https://www.strava.com/api/v3';

// ==========================================
// OAuth Flow
// ==========================================

/**
 * Initiate Strava OAuth flow by redirecting to Strava authorization page
 */
export const initiateStravaAuth = (): void => {
    const params = new URLSearchParams({
        client_id: STRAVA_CLIENT_ID,
        redirect_uri: STRAVA_REDIRECT_URI,
        response_type: 'code',
        scope: 'activity:read_all,profile:read_all',
    });

    window.location.href = `${STRAVA_AUTH_URL}?${params.toString()}`;
};

/**
 * Exchange authorization code for access token
 */
export const exchangeCodeForTokens = async (code: string): Promise<{
    tokens: StravaTokens;
    athlete: { id: number; firstname: string; lastname: string };
}> => {
    const response = await fetch(STRAVA_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: STRAVA_CLIENT_ID,
            client_secret: STRAVA_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
    }

    const data = await response.json();

    return {
        tokens: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: data.expires_at,
            athleteId: data.athlete.id,
            connectedAt: new Date(),
        },
        athlete: data.athlete,
    };
};

/**
 * Refresh expired access token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<StravaTokens> => {
    const response = await fetch(STRAVA_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: STRAVA_CLIENT_ID,
            client_secret: STRAVA_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await response.json();

    return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
        athleteId: 0, // Will be preserved from existing tokens
        connectedAt: new Date(),
    };
};

// ==========================================
// Token Storage (Firestore)
// ==========================================

/**
 * Save Strava tokens to Firestore
 */
export const saveStravaTokens = async (
    userId: string,
    tokens: StravaTokens,
    athleteName: string
): Promise<void> => {
    const tokenRef = doc(db, 'users', userId, 'integrations', 'strava');
    await setDoc(tokenRef, {
        ...tokens,
        athleteName,
        updatedAt: new Date(),
    });
};

/**
 * Get Strava tokens from Firestore
 */
export const getStravaTokens = async (userId: string): Promise<StravaTokens | null> => {
    const tokenRef = doc(db, 'users', userId, 'integrations', 'strava');
    const docSnap = await getDoc(tokenRef);

    if (!docSnap.exists()) {
        return null;
    }

    return docSnap.data() as StravaTokens;
};

/**
 * Delete Strava tokens (disconnect)
 */
export const disconnectStrava = async (userId: string): Promise<void> => {
    const tokenRef = doc(db, 'users', userId, 'integrations', 'strava');
    await deleteDoc(tokenRef);
};

/**
 * Check if Strava is connected and get connection info
 */
export const getStravaConnectionStatus = async (userId: string): Promise<{
    connected: boolean;
    athleteName?: string;
    lastSync?: Date;
}> => {
    const tokenRef = doc(db, 'users', userId, 'integrations', 'strava');
    const docSnap = await getDoc(tokenRef);

    if (!docSnap.exists()) {
        return { connected: false };
    }

    const data = docSnap.data();
    return {
        connected: true,
        athleteName: data.athleteName,
        lastSync: data.lastSync?.toDate(),
    };
};

// ==========================================
// Activity Fetching & Import
// ==========================================

/**
 * Get valid access token (refresh if expired)
 */
const getValidAccessToken = async (userId: string): Promise<string> => {
    const tokens = await getStravaTokens(userId);
    if (!tokens) {
        throw new Error('Not connected to Strava');
    }

    // Check if token is expired (with 60 second buffer)
    const now = Math.floor(Date.now() / 1000);
    if (tokens.expiresAt <= now + 60) {
        const newTokens = await refreshAccessToken(tokens.refreshToken);
        newTokens.athleteId = tokens.athleteId;
        await saveStravaTokens(userId, newTokens, '');
        return newTokens.accessToken;
    }

    return tokens.accessToken;
};

/**
 * Fetch recent activities from Strava
 */
export const fetchStravaActivities = async (
    userId: string,
    perPage: number = 30
): Promise<StravaActivity[]> => {
    const accessToken = await getValidAccessToken(userId);

    const response = await fetch(
        `${STRAVA_API_URL}/athlete/activities?per_page=${perPage}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch activities');
    }

    return response.json();
};

/**
 * Convert Strava activity type to FitTrack workout type
 */
const mapStravaTypeToWorkoutType = (stravaType: string): string => {
    const typeMap: Record<string, string> = {
        Run: 'running',
        Ride: 'cycling',
        Swim: 'swimming',
        Walk: 'walking',
        Hike: 'walking',
        WeightTraining: 'weightlifting',
        Workout: 'hiit',
        Yoga: 'yoga',
        CrossFit: 'hiit',
        Elliptical: 'cardio',
        StairStepper: 'cardio',
        Rowing: 'cardio',
    };

    return typeMap[stravaType] || 'custom';
};

/**
 * Convert Strava activity to FitTrack Workout format
 */
export const convertStravaActivityToWorkout = (
    activity: StravaActivity,
    userId: string
): Omit<Workout, 'id' | 'createdAt'> => {
    const durationMinutes = Math.round(activity.moving_time / 60);

    // Estimate calories if not provided (rough estimate based on activity type and duration)
    const estimatedCalories = activity.calories || Math.round(durationMinutes * 8);

    return {
        userId,
        type: mapStravaTypeToWorkoutType(activity.type) as Workout['type'],
        name: activity.name,
        duration: durationMinutes,
        calories: estimatedCalories,
        exercises: [],
        notes: `Imported from Strava. Distance: ${(activity.distance / 1000).toFixed(2)}km`,
        date: new Date(activity.start_date),
    };
};

/**
 * Update last sync time
 */
export const updateLastSyncTime = async (userId: string): Promise<void> => {
    const tokenRef = doc(db, 'users', userId, 'integrations', 'strava');
    await setDoc(tokenRef, { lastSync: new Date() }, { merge: true });
};
