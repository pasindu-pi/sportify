// src/redux/store.js - Redux Store Configuration
// This is the central state management hub for the entire app

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import teamsReducer from './teamsSlice';
import favouritesReducer from './favouritesSlice';

// Configure the Redux store with all reducers
// Each reducer manages a specific slice of the application state
export const store = configureStore({
  reducer: {
    // auth: handles user authentication state (isAuthenticated, user data, token)
    auth: authReducer,
    
    // teams: manages sports teams data from API (teams list, loading, errors)
    teams: teamsReducer,
    
    // favourites: stores user's favourite teams (persisted in AsyncStorage)
    favourites: favouritesReducer,
  },
  
  // Middleware for handling async actions (already included by default)
  // Redux Toolkit includes redux-thunk by default for async operations
});

// Export types for TypeScript support (optional)
// RootState: represents the entire Redux state tree
// AppDispatch: type for dispatch function with thunk support