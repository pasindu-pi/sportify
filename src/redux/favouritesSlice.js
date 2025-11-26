// src/redux/favouritesSlice.js - Manages user's favourite teams
// Persists favourites using AsyncStorage

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveFavourites, loadFavourites } from '../utils/storage';

// Initial state for favourites
const initialState = {
  favourites: [],       // Array of favourite team IDs or objects
  loading: false,       // Loading state when reading from storage
};

// Async thunk to load favourites from AsyncStorage on app start
export const loadFavouritesFromStorage = createAsyncThunk(
  'favourites/loadFromStorage',
  async () => {
    // Load favourites from AsyncStorage
    const favourites = await loadFavourites();
    return favourites;
  }
);

// Async thunk to save favourites to AsyncStorage
export const saveFavouritesToStorage = createAsyncThunk(
  'favourites/saveToStorage',
  async (favourites) => {
    // Save favourites array to AsyncStorage
    await saveFavourites(favourites);
    return favourites;
  }
);

// Create the favourites slice
const favouritesSlice = createSlice({
  name: 'favourites',   // Slice name
  initialState,         // Initial state defined above
  
  // Synchronous reducers for managing favourites
  reducers: {
    // Add a team to favourites
    addFavourite: (state, action) => {
      const team = action.payload;
      
      // Check if team is already in favourites (prevent duplicates)
      const exists = state.favourites.find(fav => fav.idTeam === team.idTeam);
      
      if (!exists) {
        // Add team to favourites array
        state.favourites.push(team);
        
        // Save to AsyncStorage (will trigger async thunk)
        // Note: We dispatch this from component to avoid side effects in reducer
      }
    },
    
    // Remove a team from favourites
    removeFavourite: (state, action) => {
      const teamId = action.payload;
      
      // Filter out the team with matching ID
      state.favourites = state.favourites.filter(
        team => team.idTeam !== teamId
      );
      
      // Save updated list to AsyncStorage
      // Note: We dispatch this from component
    },
    
    // Clear all favourites
    clearFavourites: (state) => {
      state.favourites = [];
    },
  },
  
  // Handle async thunk lifecycle
  extraReducers: (builder) => {
    builder
      // Load favourites from storage
      .addCase(loadFavouritesFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFavouritesFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      // Save favourites to storage
      .addCase(saveFavouritesToStorage.fulfilled, (state, action) => {
        state.favourites = action.payload;
      });
  },
});

// Export actions for use in components
export const { addFavourite, removeFavourite, clearFavourites } = favouritesSlice.actions;

// Export reducer to be included in store
export default favouritesSlice.reducer;