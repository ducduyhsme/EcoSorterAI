# Eco-Sorter AI - Quick Start Guide

Get started with Eco-Sorter AI in 5 minutes!

## Prerequisites

- Node.js 14+ installed
- npm or yarn
- Android Studio or Xcode (for native builds)
- Expo Go app on your phone (for quick testing)

## Quick Setup

### 1. Clone and Install

```bash
git clone https://github.com/ducduyhsme/EcoSorterAI.git
cd EcoSorterAI
npm install --legacy-peer-deps
```

### 2. Start Development Server

```bash
npm start
```

### 3. Run on Your Device

**Option A: Use Expo Go (Recommended for Quick Testing)**

1. Install Expo Go on your phone:
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in your terminal

**Option B: Use Simulator/Emulator**

```bash
# iOS
npm run ios

# Android
npm run android
```

## First Time Usage

1. **Login**: Enter any username to login (no password required for demo)

2. **Scan**: 
   - Tap the camera icon
   - Point at any waste item
   - Tap the capture button
   - See AI classification results

3. **View History**:
   - Tap the "History" tab
   - Filter by waste category
   - Pull down to refresh

4. **Check Rankings**:
   - Tap the "Ranking" tab
   - See your position on the leaderboard
   - Earn points by scanning

5. **Profile**:
   - Tap the "Profile" tab
   - View your statistics
   - Logout if needed

## Features Overview

### 🎥 Camera Scanning
- **Real-time capture**: Take photos of waste items
- **Gallery selection**: Choose existing photos
- **Instant results**: Get classification in seconds

### 🤖 AI Classification
- **4 Categories**: Organic, Inorganic, Recyclable Waste, and Non-recyclable Waste
- **Confidence scores**: See how sure the AI is
- **Auto-improvement**: High confidence results train the model

### 📊 Smart Features
- **Low confidence handling**: Automatically sends uncertain images to server
- **Cloud sync**: Your data syncs across devices
- **History filtering**: Find past scans by category
- **Points system**: Earn points for every scan

### 🏆 Gamification
- **Leaderboard**: Compete with other users
- **Points rewards**: Higher confidence = more points
- **Achievement tracking**: Monitor your progress

## Development Tips

### Testing the App

**Camera Testing**:
- Camera only works on real devices, not simulators
- Use gallery selection for simulator testing
- Test with various lighting conditions

**AI Model**:
- First classification may take longer (model initialization)
- Model improves with more scans
- Check console logs for debugging

**Data Persistence**:
- All data stored locally in AsyncStorage
- Clear app data to reset: Long press app → App Info → Clear Data

### Customization

**Change Categories**:
Edit `src/services/aiService.js`:
```javascript
const CATEGORIES = ['Organic', 'Inorganic', 'Recyclable Waste', 'Non-recyclable Waste'];
```

**Adjust Thresholds**:
Edit `src/config/constants.js`:
```javascript
export const CONFIDENCE_THRESHOLD_HIGH = 0.8;
export const CONFIDENCE_THRESHOLD_LOW = 0.7;
```

**Modify Points**:
Edit `src/config/constants.js`:
```javascript
export const POINTS_BASE = 10;
export const POINTS_HIGH_CONFIDENCE = 20;
```

### Adding Backend

1. Create backend API (see API_DOCUMENTATION.md)
2. Update service files:
   - `src/services/storageService.js` - uploadToServer()
   - `src/services/rankingService.js` - syncRankings()
3. Add API_URL to environment variables
4. Implement authentication tokens

## Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm start -- --reset-cache
```

### Camera not working
- Check permissions in device settings
- Restart the app
- Use gallery selection as fallback

### TensorFlow errors
```bash
# Reinstall TensorFlow packages
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native --legacy-peer-deps
```

### Build errors
```bash
# For iOS
cd ios && pod install && cd ..

# For Android
cd android && ./gradlew clean && cd ..
```

## Next Steps

1. **Read Full Documentation**:
   - [README.md](README.md) - Project overview
   - [SETUP.md](SETUP.md) - Detailed setup
   - [TENSORFLOW_GUIDE.md](TENSORFLOW_GUIDE.md) - Model training
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Backend API

2. **Implement Backend**:
   - Set up server for cloud features
   - Implement API endpoints
   - Configure cloud storage

3. **Train Better Model**:
   - Collect real waste images
   - Train model with diverse dataset
   - Implement transfer learning

4. **Add Features**:
   - Push notifications
   - Social sharing
   - Analytics dashboard
   - Multi-language support

## Support

- 📚 Documentation: See docs folder
- 🐛 Issues: Open on GitHub
- 💬 Questions: GitHub Discussions

## Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [React Navigation](https://reactnavigation.org)

---

**Happy Sorting! 🌱♻️**
