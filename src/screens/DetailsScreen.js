// src/screens/DetailsScreen.js - Shows detailed team information
// Allows users to add/remove teams from favourites

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';

// Import Redux actions
import {
  addFavourite,
  removeFavourite,
  saveFavouritesToStorage,
} from '../redux/favouritesSlice';

export default function DetailsScreen() {
  const dispatch = useDispatch();
  
  // Get selected team from Redux
  const team = useSelector((state) => state.teams.selectedTeam);
  const favourites = useSelector((state) => state.favourites.favourites);

  // Check if this team is in favourites
  const isFavourite = favourites.some((fav) => fav.idTeam === team?.idTeam);

  /**
   * Toggle favourite status
   * Add to favourites if not present, remove if already favourited
   */
  const handleToggleFavourite = () => {
    if (isFavourite) {
      // Remove from favourites
      dispatch(removeFavourite(team.idTeam));
    } else {
      // Add to favourites
      dispatch(addFavourite(team));
    }
    
    // Save updated favourites to AsyncStorage
    // We need to get updated favourites from store
    setTimeout(() => {
      const state = require('../redux/store').store.getState();
      dispatch(saveFavouritesToStorage(state.favourites.favourites));
    }, 100);
  };

  /**
   * Open team website in browser
   */
  const handleOpenWebsite = () => {
    if (team?.strWebsite) {
      const url = team.strWebsite.startsWith('http')
        ? team.strWebsite
        : `https://${team.strWebsite}`;
      Linking.openURL(url);
    }
  };

  /**
   * Open social media links
   */
  const handleOpenSocial = (url) => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      Linking.openURL(fullUrl);
    }
  };

  // Handle case when no team is selected
  if (!team) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="alert-circle" size={64} color="#9CA3AF" />
        <Text style={styles.errorText}>No team selected</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section with Team Badge */}
      <View style={styles.heroSection}>
        {team.strTeamBadge ? (
          <Image
            source={{ uri: team.strTeamBadge }}
            style={styles.teamBadge}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.badgePlaceholder}>
            <Feather name="shield" size={80} color="#9CA3AF" />
          </View>
        )}

        {/* Team Name */}
        <Text style={styles.teamName}>{team.strTeam}</Text>
        
        {/* League/Competition */}
        {team.strLeague && (
          <Text style={styles.league}>{team.strLeague}</Text>
        )}

        {/* Favourite Button */}
        <TouchableOpacity
          style={[
            styles.favouriteButton,
            isFavourite && styles.favouriteButtonActive,
          ]}
          onPress={handleToggleFavourite}
        >
          <Feather
            name={isFavourite ? 'heart' : 'heart'}
            size={20}
            color={isFavourite ? '#fff' : '#EF4444'}
            fill={isFavourite ? '#EF4444' : 'none'}
          />
          <Text
            style={[
              styles.favouriteButtonText,
              isFavourite && styles.favouriteButtonTextActive,
            ]}
          >
            {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Information Cards */}
      <View style={styles.content}>
        {/* Basic Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Information</Text>
          
          {team.intFormedYear && (
            <InfoRow icon="calendar" label="Founded" value={team.intFormedYear} />
          )}
          
          {team.strStadium && (
            <InfoRow icon="map-pin" label="Stadium" value={team.strStadium} />
          )}
          
          {team.strStadiumLocation && (
            <InfoRow icon="navigation" label="Location" value={team.strStadiumLocation} />
          )}
          
          {team.intStadiumCapacity && (
            <InfoRow
              icon="users"
              label="Capacity"
              value={team.intStadiumCapacity.toLocaleString()}
            />
          )}
          
          {team.strSport && (
            <InfoRow icon="dribbble" label="Sport" value={team.strSport} />
          )}
        </View>

        {/* Description */}
        {team.strDescriptionEN && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.description}>{team.strDescriptionEN}</Text>
          </View>
        )}

        {/* Links Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Links</Text>
          
          {team.strWebsite && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleOpenWebsite}
            >
              <Feather name="globe" size={20} color="#4F46E5" />
              <Text style={styles.linkText}>Visit Website</Text>
              <Feather name="external-link" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          
          {team.strFacebook && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenSocial(team.strFacebook)}
            >
              <Feather name="facebook" size={20} color="#4F46E5" />
              <Text style={styles.linkText}>Facebook</Text>
              <Feather name="external-link" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          
          {team.strTwitter && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenSocial(team.strTwitter)}
            >
              <Feather name="twitter" size={20} color="#4F46E5" />
              <Text style={styles.linkText}>Twitter</Text>
              <Feather name="external-link" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          
          {team.strInstagram && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenSocial(team.strInstagram)}
            >
              <Feather name="instagram" size={20} color="#4F46E5" />
              <Text style={styles.linkText}>Instagram</Text>
              <Feather name="external-link" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Jersey Colors */}
        {(team.strColour1 || team.strColour2 || team.strColour3) && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Team Colors</Text>
            <View style={styles.colorsContainer}>
              {team.strColour1 && (
                <View style={styles.colorItem}>
                  <View
                    style={[
                      styles.colorBox,
                      { backgroundColor: `#${team.strColour1}` },
                    ]}
                  />
                  <Text style={styles.colorLabel}>Primary</Text>
                </View>
              )}
              {team.strColour2 && (
                <View style={styles.colorItem}>
                  <View
                    style={[
                      styles.colorBox,
                      { backgroundColor: `#${team.strColour2}` },
                    ]}
                  />
                  <Text style={styles.colorLabel}>Secondary</Text>
                </View>
              )}
              {team.strColour3 && (
                <View style={styles.colorItem}>
                  <View
                    style={[
                      styles.colorBox,
                      { backgroundColor: `#${team.strColour3}` },
                    ]}
                  />
                  <Text style={styles.colorLabel}>Tertiary</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

/**
 * Reusable component for information rows
 */
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <Feather name={icon} size={18} color="#6B7280" />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  heroSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  teamBadge: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  badgePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  league: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  favouriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 8,
  },
  favouriteButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  favouriteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  favouriteButtonTextActive: {
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  colorItem: {
    alignItems: 'center',
    gap: 8,
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  colorLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
});