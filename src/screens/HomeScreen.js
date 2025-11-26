// src/screens/HomeScreen.js - Main screen showing teams list
// Fetches and displays sports teams from API

import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

// Import Redux actions
import { getTeams, setSelectedTeam } from '../redux/teamsSlice';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Get teams data and loading state from Redux
  const { teams, loading, error } = useSelector((state) => state.teams);
  const favourites = useSelector((state) => state.favourites.favourites);

  // Fetch teams when component mounts
  useEffect(() => {
    fetchTeamsData();
  }, []);

  /**
   * Fetch teams from API
   */
  const fetchTeamsData = () => {
    dispatch(getTeams());
  };

  /**
   * Handle team card press - navigate to details screen
   * @param {Object} team - Selected team object
   */
  const handleTeamPress = (team) => {
    // Set selected team in Redux
    dispatch(setSelectedTeam(team));
    
    // Navigate to details screen
    navigation.navigate('Details');
  };

  /**
   * Check if a team is in favourites
   * @param {string} teamId - Team ID to check
   * @returns {boolean} - True if team is favourited
   */
  const isFavourite = (teamId) => {
    return favourites.some((fav) => fav.idTeam === teamId);
  };

  /**
   * Render individual team card
   * @param {Object} item - Team object
   */
  const renderTeamCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleTeamPress(item)}
      activeOpacity={0.7}
    >
      {/* Team Badge/Logo */}
      <View style={styles.imageContainer}>
        {item.strTeamBadge ? (
          <Image
            source={{ uri: item.strTeamBadge }}
            style={styles.teamImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="shield" size={40} color="#9CA3AF" />
          </View>
        )}
      </View>

      {/* Team Info */}
      <View style={styles.cardContent}>
        <Text style={styles.teamName} numberOfLines={1}>
          {item.strTeam}
        </Text>
        
        <Text style={styles.league} numberOfLines={1}>
          {item.strLeague || 'League Unknown'}
        </Text>
        
        {/* Status Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.strSport || 'Soccer'}
            </Text>
          </View>
          
          {/* Favourite Indicator */}
          {isFavourite(item.idTeam) && (
            <Feather name="heart" size={16} color="#EF4444" />
          )}
        </View>
      </View>

      {/* Arrow Icon */}
      <Feather name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );

  /**
   * Render empty state when no teams
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="inbox" size={64} color="#9CA3AF" />
      <Text style={styles.emptyText}>No teams found</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchTeamsData}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render error state
   */
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTeamsData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>IPL Cricket Teams</Text>
        <Text style={styles.headerSubtitle}>
          {teams.length} teams available
        </Text>
      </View>

      {/* Teams List */}
      <FlatList
        data={teams}
        renderItem={renderTeamCard}
        keyExtractor={(item) => item.idTeam}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchTeamsData}
            colors={['#4F46E5']}
          />
        }
      />

      {/* Loading Indicator (initial load) */}
      {loading && teams.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading teams...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 16,
  },
  teamImage: {
    width: 60,
    height: 60,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  league: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 250, 251, 0.9)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});