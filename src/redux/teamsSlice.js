// src/redux/teamsSlice.js - Manages sports teams data
// Fetches and stores teams data from TheSportsDB API

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTeams } from '../services/api';

// Initial state for teams data
const initialState = {
  teams: [],            // Array of team objects from API
  loading: false,       // Loading state during API fetch
  error: null,          // Error message if fetch fails
  selectedTeam: null,   // Currently selected team for details screen
  selectedLeague: 'Indian%20Premier%20League', // Currently selected league
};

// Async thunk to fetch teams from API by league
// This action can be dispatched from any component
export const getTeams = createAsyncThunk(
  'teams/getTeams',     // Action type name
  async (leagueApiName = 'Indian%20Premier%20League', { rejectWithValue }) => {
    try {
      // Call the API service to fetch teams for the selected league
      const data = await fetchTeams(leagueApiName);
      
      // Return the teams array (will be stored in state)
      return data.teams || [];
    } catch (error) {
      // Return error message if fetch fails
      return rejectWithValue(error.message || 'Failed to fetch teams');
    }
  }
);

// Create the teams slice
const teamsSlice = createSlice({
  name: 'teams',        // Slice name
  initialState,         // Initial state defined above
  
  // Synchronous reducers
  reducers: {
    // Set the selected team for the details screen
    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload;
    },
    
    // Clear selected team (useful when navigating back)
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
    
    // Set the selected league
    setSelectedLeague: (state, action) => {
      state.selectedLeague = action.payload;
    },
    
    // Clear any error messages
    clearTeamsError: (state) => {
      state.error = null;
    },
  },
  
  // Handle async thunk lifecycle for getTeams
  extraReducers: (builder) => {
    builder
      // When fetch starts - set loading to true
      .addCase(getTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When fetch succeeds - store teams data
      .addCase(getTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
        state.error = null;
      })
      // When fetch fails - store error message
      .addCase(getTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions for use in components
export const { 
  setSelectedTeam, 
  clearSelectedTeam, 
  setSelectedLeague,
  clearTeamsError 
} = teamsSlice.actions;

// Export reducer to be included in store
export default teamsSlice.reducer;