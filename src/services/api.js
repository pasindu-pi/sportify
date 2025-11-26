// src/services/api.js - API service layer
// Centralizes all API calls for authentication and sports data

import axios from 'axios';

// Base URLs for different APIs
const AUTH_API = 'https://dummyjson.com';
const SPORTS_API = 'https://www.thesportsdb.com/api/v1/json/3';

// ============================================
// AUTHENTICATION API
// ============================================

/**
 * Login user with credentials
 * @param {Object} credentials - { username, password }
 * @returns {Promise} - User data with token
 */
export const loginUser = async (credentials) => {
  try {
    // Make POST request to login endpoint
    const response = await axios.post(`${AUTH_API}/auth/login`, {
      username: credentials.username,
      password: credentials.password,
    });
    
    // Return user data (includes token, username, email, etc.)
    return response.data;
  } catch (error) {
    // Handle API errors
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response from server. Check your internet connection.');
    } else {
      // Something else went wrong
      throw new Error('An error occurred during login');
    }
  }
};

// ============================================
// SPORTS DATA API
// ============================================

/**
 * Fetch Cricket teams from England
 * @returns {Promise} - Array of teams
 */
export const fetchTeams = async () => {
  try {
    // Make GET request to search teams endpoint
    // Parameters: s=Soccer (sport), c=England (country)
    const leagues = [
      'Indian%20Premier%20League',  // IPL
      'Big%20Bash%20League',        // BBL (Australia)
      'Pakistan%20Super%20League',  // PSL
      'Caribbean%20Premier%20League' // CPL
    ];
    
    // Fetch from IPL (or change index to get different league)
    const response = await axios.get(
      `${SPORTS_API}/search_all_teams.php?l=${leagues[0]}`
    );
    
    // Return teams data
    return response.data;
  } catch (error) {
    // Handle API errors
    if (error.response) {
      throw new Error('Failed to fetch teams from API');
    } else if (error.request) {
      throw new Error('No response from sports API. Check your internet connection.');
    } else {
      throw new Error('An error occurred while fetching teams');
    }
  }
};

/**
 * Search teams by name
 * @param {string} teamName - Name of the team to search
 * @returns {Promise} - Array of matching teams
 */
export const searchTeams = async (teamName) => {
  try {
    const response = await axios.get(
      `${SPORTS_API}/searchteams.php?t=${teamName}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to search teams');
  }
};

/**
 * Get team details by ID
 * @param {string} teamId - ID of the team
 * @returns {Promise} - Team details
 */
export const getTeamDetails = async (teamId) => {
  try {
    const response = await axios.get(
      `${SPORTS_API}/lookupteam.php?id=${teamId}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch team details');
  }
};

// Export all API functions
export default {
  loginUser,
  fetchTeams,
  searchTeams,
  getTeamDetails,
};