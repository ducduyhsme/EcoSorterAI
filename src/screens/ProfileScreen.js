import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClassificationHistory } from '../services/storageService';
import { getUserStats } from '../services/rankingService';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalScans: 0,
    accurateScans: 0,
    points: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('user');
            // Navigation will be handled by App.js
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#fff" />
          </View>
        </View>
        <Text style={styles.username}>{user?.username || 'User'}</Text>
        <Text style={styles.memberSince}>Member since {new Date().getFullYear()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="camera" size={30} color="#4CAF50" />
          <Text style={styles.statValue}>{stats.totalScans}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={30} color="#4CAF50" />
          <Text style={styles.statValue}>{stats.accurateScans}</Text>
          <Text style={styles.statLabel}>Accurate</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trophy" size={30} color="#FFD700" />
          <Text style={styles.statValue}>{stats.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Eco-Sorter AI helps you properly classify and sort waste using advanced
            AI technology. Every scan helps improve the environment!
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it Works</Text>
        <View style={styles.infoCard}>
          <View style={styles.stepContainer}>
            <Ionicons name="camera" size={24} color="#4CAF50" />
            <Text style={styles.stepText}>1. Capture or select an image</Text>
          </View>
          <View style={styles.stepContainer}>
            <Ionicons name="analytics" size={24} color="#4CAF50" />
            <Text style={styles.stepText}>2. AI analyzes the waste type</Text>
          </View>
          <View style={styles.stepContainer}>
            <Ionicons name="checkbox" size={24} color="#4CAF50" />
            <Text style={styles.stepText}>3. Get classification result</Text>
          </View>
          <View style={styles.stepContainer}>
            <Ionicons name="cloud-upload" size={24} color="#4CAF50" />
            <Text style={styles.stepText}>4. Low confidence images sent to server</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2026 Eco-Sorter AI</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -30,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
});
