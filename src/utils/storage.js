// src/utils/storage.js - AsyncStorage utility functions
// Handles persistent data storage for authentication and favourites

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys - constants to avoid typos
const STORAGE_KEYS = {
  TOKEN: '@sportify_token',
  USER: '@sportify_user',
  FAVOURITES: '@sportify_favourites',
};

// ============================================
// AUTHENTICATION STORAGE
// ============================================

/**
 * Save authentication token to storage
 * @param {string} token - JWT token from login
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

/**
 * Get authentication token from storage
 * @returns {Promise<string|null>} - Token or null if not found
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Remove authentication token from storage (logout)
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Save user data to storage
 * @param {Object} user - User object from login response
 */
export const saveUser = async (user) => {
  try {
    // Convert object to JSON string for storage
    const userString = JSON.stringify(user);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, userString);
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

/**
 * Get user data from storage
 * @returns {Promise<Object|null>} - User object or null
 */
export const getUser = async () => {
  try {
    const userString = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    // Parse JSON string back to object
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Remove user data from storage
 */
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// ============================================
// FAVOURITES STORAGE
// ============================================

/**
 * Save favourites array to storage
 * @param {Array} favourites - Array of favourite team objects
 */
export const saveFavourites = async (favourites) => {
  try {
    // Convert array to JSON string
    const favouritesString = JSON.stringify(favourites);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, favouritesString);
  } catch (error) {
    console.error('Error saving favourites:', error);
  }
};

/**
 * Load favourites array from storage
 * @returns {Promise<Array>} - Array of favourite teams (empty array if none)
 */
export const loadFavourites = async () => {
  try {
    const favouritesString = await AsyncStorage.getItem(STORAGE_KEYS.FAVOURITES);
    // Parse and return, or return empty array if null
    return favouritesString ? JSON.parse(favouritesString) : [];
  } catch (error) {
    console.error('Error loading favourites:', error);
    return [];
  }
};

/**
 * Clear all favourites from storage
 */
export const clearFavourites = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.FAVOURITES);
  } catch (error) {
    console.error('Error clearing favourites:', error);
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Clear all app data from storage (useful for testing or logout)
 */
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.FAVOURITES,
    ]);
  } catch (error) {
    console.error('Error clearing all storage:', error);
  }
};

/**
 * Check if user is logged in (has token)
 * @returns {Promise<boolean>} - True if token exists
 */
export const isLoggedIn = async () => {
  const token = await getToken();
  return !!token; // Convert to boolean
};

// Export all functions
export default {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  saveFavourites,
  loadFavourites,
  clearFavourites,
  clearAllStorage,
  isLoggedIn,
};