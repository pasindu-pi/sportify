// src/redux/authSlice.js - Manages authentication state
// Handles login, logout, and persisting user session

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../services/api';
import { saveToken, removeToken } from '../utils/storage';

// Initial state for authentication
const initialState = {
  user: null,           // Stores user information (username, email, etc.)
  token: null,          // JWT token for API authentication
  isAuthenticated: false, // Boolean flag to check if user is logged in
  loading: false,       // Loading state during login API call
  error: null,          // Stores error messages if login fails
};

// Async thunk for login - handles API call and side effects
// This runs outside the reducer and can perform async operations
export const login = createAsyncThunk(
  'auth/login',         // Action type name
  async (credentials, { rejectWithValue }) => {
    try {
      // Call the login API with username and password
      const response = await loginUser(credentials);
      
      // Save token to AsyncStorage for persistence across app restarts
      await saveToken(response.token);
      
      // Return the response data (will be used in fulfilled case)
      return response;
    } catch (error) {
      // If API call fails, return error message
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Create the auth slice with reducers and actions
const authSlice = createSlice({
  name: 'auth',         // Slice name (used in action types)
  initialState,         // Initial state defined above
  
  // Regular reducers for synchronous actions
  reducers: {
    // Logout action - clears user data and token
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Remove token from AsyncStorage
      removeToken();
    },
    
    // Restore session - used when app restarts with saved token
    restoreSession: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    
    // Clear error messages
    clearError: (state) => {
      state.error = null;
    },
  },
  
  // Extra reducers handle async thunk lifecycle (pending, fulfilled, rejected)
  extraReducers: (builder) => {
    builder
      // When login starts - set loading to true
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When login succeeds - save user data and token
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.error = null;
      })
      // When login fails - store error message
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

// Export actions for use in components
export const { logout, restoreSession, clearError } = authSlice.actions;

// Export reducer to be included in store
export default authSlice.reducer;