// src/navigation/TabNavigator.js - Bottom tab navigation
// Provides navigation between Home, Favourites, and Profile screens

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Configure tab bar icons based on route name
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Select icon based on screen
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Favourites') {
            iconName = 'heart';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          // Return the icon component
          // Feather is a popular icon library with clean, minimal icons
          return <Feather name={iconName} size={size} color={color} />;
        },
        
        // Tab bar styling
        tabBarActiveTintColor: '#4F46E5',    // Active tab color (indigo)
        tabBarInactiveTintColor: '#9CA3AF',  // Inactive tab color (gray)
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        
        // Header styling
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      {/* Home Tab - Shows list of teams */}
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Teams',
          tabBarLabel: 'Home',
        }}
      />
      
      {/* Favourites Tab - Shows saved favourite teams */}
      <Tab.Screen 
        name="Favourites" 
        component={FavouritesScreen}
        options={{
          title: 'My Favourites',
          tabBarLabel: 'Favourites',
        }}
      />
      
      {/* Profile Tab - Shows user info and logout */}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}