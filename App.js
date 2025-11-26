// App.js - Main entry point of the application
// This file sets up Redux store and wraps the app with Provider

import React from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // GestureHandlerRootView enables gesture handling for navigation
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Provider makes Redux store available to all components */}
      <Provider store={store}>
        {/* StatusBar controls the appearance of the device status bar */}
        <StatusBar style="auto" />
        {/* AppNavigator contains all navigation logic */}
        <AppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}