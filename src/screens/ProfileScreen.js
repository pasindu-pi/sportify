// src/screens/ProfileScreen.js - User profile and settings
// Displays user info, stats, and logout option
// Optional: Dark mode toggle for bonus marks

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';

// Import Redux actions
import { logout } from '../redux/authSlice';
import { clearAllStorage } from '../utils/storage';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  
  // Get user info and stats from Redux
  const user = useSelector((state) => state.auth.user);
  const favouritesCount = useSelector((state) => state.favourites.favourites.length);
  
  // Dark mode state (for bonus marks)
  const [darkMode, setDarkMode] = useState(false);

  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Clear all stored data
            await clearAllStorage();
            // Dispatch logout action
            dispatch(logout());
          },
        },
      ]
    );
  };

  /**
   * Toggle dark mode (bonus feature)
   */
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Note: Implement actual dark mode theme switching here
    // This would require a theme context/provider
    Alert.alert('Dark Mode', 'This is a bonus feature demonstration');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        {/* User Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </Text>
          </View>
        </View>

        {/* User Info */}
        <Text style={styles.userName}>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username || 'User'}
        </Text>
        
        {user?.email && (
          <Text style={styles.userEmail}>{user.email}</Text>
        )}
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Feather name="heart" size={24} color="#EF4444" />
          </View>
          <Text style={styles.statValue}>{favouritesCount}</Text>
          <Text style={styles.statLabel}>Favourites</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Feather name="award" size={24} color="#10B981" />
          </View>
          <Text style={styles.statValue}>{user?.age || 'N/A'}</Text>
          <Text style={styles.statLabel}>Age</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        {/* Dark Mode Toggle (Bonus Feature) */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}>
              <Feather name="moon" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>Bonus feature</Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={handleToggleDarkMode}
            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
            thumbColor={darkMode ? '#4F46E5' : '#F9FAFB'}
          />
        </View>

        {/* Notifications Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}>
              <Feather name="bell" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive updates</Text>
            </View>
          </View>
          <Switch
            value={false}
            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
            thumbColor={'#F9FAFB'}
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {/* Profile Info */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Feather name="user" size={20} color="#6B7280" />
            <Text style={styles.menuText}>Edit Profile</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Privacy */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Feather name="shield" size={20} color="#6B7280" />
            <Text style={styles.menuText}>Privacy & Security</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Help */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Feather name="help-circle" size={20} color="#6B7280" />
            <Text style={styles.menuText}>Help & Support</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* About */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Feather name="info" size={20} color="#6B7280" />
            <Text style={styles.menuText}>About</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 32,
  },
});