// src/navigation/AppNavigator.js - Main navigation container
// Handles authentication-based navigation (Login vs Main App)

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import DetailsScreen from '../screens/DetailsScreen';

// Import actions
import { restoreSession } from '../redux/authSlice';
import { loadFavouritesFromStorage } from '../redux/favouritesSlice';
import { getToken, getUser } from '../utils/storage';

// Create Stack Navigator
const Stack = createStackNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch();
  
  // Get authentication state from Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Check for saved session on app start
  useEffect(() => {
    checkSavedSession();
    loadSavedFavourites();
  }, []);

  /**
   * Check if user has a saved session (token + user data)
   * Restore session if valid token found
   */
  const checkSavedSession = async () => {
    const token = await getToken();
    const user = await getUser();
    
    // If both token and user exist, restore session
    if (token && user) {
      dispatch(restoreSession({ token, user }));
    }
  };

  /**
   * Load saved favourites from AsyncStorage
   */
  const loadSavedFavourites = () => {
    dispatch(loadFavouritesFromStorage());
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4F46E5', // Indigo color
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* 
          Conditional rendering based on authentication status
          If NOT authenticated: Show Login screen
          If authenticated: Show Tab Navigator (Home, Favourites, Profile)
        */}
        {!isAuthenticated ? (
          // Authentication Stack (Login only)
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }} // Hide header on login
          />
        ) : (
          // Main App Stack (Tabs + Details)
          <>
            <Stack.Screen 
              name="Main" 
              component={TabNavigator}
              options={{ headerShown: false }} // Tab navigator has its own header
            />
            <Stack.Screen 
              name="Details" 
              component={DetailsScreen}
              options={{ 
                title: 'Team Details',
                headerBackTitle: 'Back', // iOS back button text
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}