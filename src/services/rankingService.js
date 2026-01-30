import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClassificationHistory } from './storageService';
import {
  CONFIDENCE_THRESHOLD_MEDIUM,
  POINTS_BASE,
  POINTS_HIGH_CONFIDENCE,
  POINTS_MEDIUM_CONFIDENCE,
} from '../config/constants';

const RANKINGS_KEY = 'user_rankings';

/**
 * Calculate user statistics
 */
export async function getUserStats() {
  try {
    const history = await getClassificationHistory();
    const user = await AsyncStorage.getItem('user');
    
    if (!user) {
      return {
        totalScans: 0,
        accurateScans: 0,
        points: 0,
      };
    }
    
    const userData = JSON.parse(user);
    
    // Calculate stats
    const totalScans = history.length;
    const accurateScans = history.filter(item => item.confidence >= CONFIDENCE_THRESHOLD_MEDIUM).length;
    const points = calculatePoints(history);
    
    // Update user stats in rankings
    await updateUserRanking(userData.username, {
      totalScans,
      accurateScans,
      points,
    });
    
    return {
      totalScans,
      accurateScans,
      points,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalScans: 0,
      accurateScans: 0,
      points: 0,
    };
  }
}

/**
 * Calculate points based on classification history
 */
function calculatePoints(history) {
  let points = 0;
  
  history.forEach(item => {
    // Base points for each scan
    points += POINTS_BASE;
    
    // Bonus points for high confidence
    if (item.confidence >= 0.9) {
      points += POINTS_HIGH_CONFIDENCE;
    } else if (item.confidence >= CONFIDENCE_THRESHOLD_MEDIUM) {
      points += POINTS_MEDIUM_CONFIDENCE;
    }
  });
  
  return points;
}

/**
 * Update user ranking
 */
async function updateUserRanking(username, stats) {
  try {
    const rankingsJson = await AsyncStorage.getItem(RANKINGS_KEY);
    let rankings = rankingsJson ? JSON.parse(rankingsJson) : [];
    
    // Find or create user entry
    let userEntry = rankings.find(r => r.username === username);
    
    if (userEntry) {
      // Update existing entry
      userEntry.totalScans = stats.totalScans;
      userEntry.accurateScans = stats.accurateScans;
      userEntry.points = stats.points;
      userEntry.lastUpdated = new Date().toISOString();
    } else {
      // Create new entry
      userEntry = {
        username,
        totalScans: stats.totalScans,
        accurateScans: stats.accurateScans,
        points: stats.points,
        joinedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      rankings.push(userEntry);
    }
    
    // Sort by points (descending)
    rankings.sort((a, b) => b.points - a.points);
    
    // Save updated rankings
    await AsyncStorage.setItem(RANKINGS_KEY, JSON.stringify(rankings));
  } catch (error) {
    console.error('Error updating user ranking:', error);
  }
}

/**
 * Get user rankings leaderboard
 */
export async function getUserRankings() {
  try {
    // Get local rankings
    const rankingsJson = await AsyncStorage.getItem(RANKINGS_KEY);
    let rankings = rankingsJson ? JSON.parse(rankingsJson) : [];
    
    // In a real app, this would also fetch from server
    // and merge with local data
    
    // Add some demo users if rankings is empty
    if (rankings.length === 0) {
      rankings = generateDemoRankings();
      await AsyncStorage.setItem(RANKINGS_KEY, JSON.stringify(rankings));
    }
    
    // Sort by points
    rankings.sort((a, b) => b.points - a.points);
    
    return rankings;
  } catch (error) {
    console.error('Error getting rankings:', error);
    return [];
  }
}

/**
 * Generate demo rankings for demonstration
 */
function generateDemoRankings() {
  return [
    {
      username: 'EcoWarrior',
      totalScans: 156,
      accurateScans: 145,
      points: 3580,
      joinedDate: new Date(2024, 0, 15).toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      username: 'GreenHero',
      totalScans: 132,
      accurateScans: 120,
      points: 2980,
      joinedDate: new Date(2024, 1, 20).toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      username: 'RecycleKing',
      totalScans: 98,
      accurateScans: 92,
      points: 2240,
      joinedDate: new Date(2024, 2, 10).toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      username: 'EarthLover',
      totalScans: 87,
      accurateScans: 80,
      points: 1970,
      joinedDate: new Date(2024, 2, 25).toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      username: 'WasteSorter',
      totalScans: 65,
      accurateScans: 58,
      points: 1450,
      joinedDate: new Date(2024, 3, 5).toISOString(),
      lastUpdated: new Date().toISOString(),
    },
  ];
}

/**
 * Sync rankings with server
 */
export async function syncRankings() {
  try {
    console.log('Syncing rankings with server...');
    
    // In a real app, this would sync with server
    // const response = await fetch('https://your-server.com/api/rankings', {
    //   method: 'GET',
    // });
    // const serverRankings = await response.json();
    
    // Merge server and local rankings
    // ...
    
    console.log('Rankings synced (simulated)');
    return true;
  } catch (error) {
    console.error('Error syncing rankings:', error);
    return false;
  }
}

/**
 * Award bonus points for achievements
 */
export async function awardBonusPoints(username, points, reason) {
  try {
    const rankingsJson = await AsyncStorage.getItem(RANKINGS_KEY);
    let rankings = rankingsJson ? JSON.parse(rankingsJson) : [];
    
    const userEntry = rankings.find(r => r.username === username);
    if (userEntry) {
      userEntry.points += points;
      userEntry.lastUpdated = new Date().toISOString();
      
      // Sort by points
      rankings.sort((a, b) => b.points - a.points);
      
      await AsyncStorage.setItem(RANKINGS_KEY, JSON.stringify(rankings));
      
      console.log(`Awarded ${points} bonus points to ${username} for: ${reason}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error awarding bonus points:', error);
    return false;
  }
}
