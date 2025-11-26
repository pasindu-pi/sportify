// src/screens/FavouritesScreen.js - Displays user's favourite teams
// Shows all teams that user has saved as favourites

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

// Import Redux actions
import { removeFavourite, saveFavouritesToStorage } from '../redux/favouritesSlice';
import { setSelectedTeam } from '../redux/teamsSlice';

export default function FavouritesScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Get favourites from Redux store
  const favourites = useSelector((state) => state.favourites.favourites);

  /**
   * Navigate to team details
   * @param {Object} team - Selected team object
   */
  const handleTeamPress = (team) => {
    dispatch(setSelectedTeam(team));
    navigation.navigate('Details');
  };

  /**
   * Remove team from favourites with confirmation
   * @param {Object} team - Team to remove
   */
  const handleRemoveFavourite = (team) => {
    Alert.alert(
      'Remove Favourite',
      `Remove ${team.strTeam} from favourites?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeFavourite(team.idTeam));
            // Save updated favourites to storage
            setTimeout(() => {
              const state = require('../redux/store').store.getState();
              dispatch(saveFavouritesToStorage(state.favourites.favourites));
            }, 100);
          },
        },
      ]
    );
  };

  /**
   * Render individual favourite team card
   */
  const renderFavouriteCard = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleTeamPress(item)}
        activeOpacity={0.7}
      >
        {/* Team Badge */}
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
        <View style={styles.teamInfo}>
          <Text style={styles.teamName} numberOfLines={1}>
            {item.strTeam}
          </Text>
          
          <Text style={styles.league} numberOfLines={1}>
            {item.strLeague || 'League Unknown'}
          </Text>
          
          {item.strStadium && (
            <View style={styles.stadiumRow}>
              <Feather name="map-pin" size={12} color="#9CA3AF" />
              <Text style={styles.stadium} numberOfLines={1}>
                {item.strStadium}
              </Text>
            </View>
          )}
        </View>

        {/* View Details Icon */}
        <Feather name="chevron-right" size={24} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Remove Button */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavourite(item)}
      >
        <Feather name="trash-2" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  /**
   * Render empty state when no favourites
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Feather name="heart" size={64} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyTitle}>No Favourites Yet</Text>
      <Text style={styles.emptyText}>
        Start adding your favourite teams from the Home screen
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Feather name="compass" size={20} color="#fff" />
        <Text style={styles.browseButtonText}>Browse Teams</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      {favourites.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {favourites.length} {favourites.length === 1 ? 'Team' : 'Teams'} Saved
          </Text>
        </View>
      )}

      {/* Favourites List */}
      <FlatList
        data={favourites}
        renderItem={renderFavouriteCard}
        keyExtractor={(item) => item.idTeam}
        contentContainerStyle={[
          styles.listContent,
          favourites.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
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
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  teamInfo: {
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
    marginBottom: 6,
  },
  stadiumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stadium: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FEF2F2',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});