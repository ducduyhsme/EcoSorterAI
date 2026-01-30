# Setup Guide for Eco-Sorter AI

This guide will help you set up and run the Eco-Sorter AI mobile application.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Expo CLI** (optional, but recommended)
   ```bash
   npm install -g expo-cli
   ```

4. **Development Environment**
   
   For iOS development:
   - macOS computer
   - Xcode (latest version)
   - iOS Simulator
   
   For Android development:
   - Android Studio
   - Android SDK
   - Android Emulator or physical device

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ducduyhsme/EcoSorterAI.git
cd EcoSorterAI
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` due to some peer dependency conflicts between TensorFlow.js and Expo Camera versions.

### 3. Create Required Assets

The app requires icon and splash screen images. Replace the placeholder files in the `assets/` directory with actual images:

- `assets/icon.png` - App icon (1024x1024 px)
- `assets/splash.png` - Splash screen (1284x2778 px for iPhone 13 Pro Max)
- `assets/adaptive-icon.png` - Android adaptive icon (1024x1024 px)
- `assets/favicon.png` - Web favicon (48x48 px)

You can use the default Expo images temporarily by running:
```bash
npx expo prebuild --clean
```

### 4. Start the Development Server

```bash
npm start
```

This will start the Expo development server and open the Expo DevTools in your browser.

## Running the App

### On iOS Simulator

```bash
npm run ios
```

Or press `i` in the terminal where the dev server is running.

### On Android Emulator

```bash
npm run android
```

Or press `a` in the terminal where the dev server is running.

### On Physical Device

1. Install the Expo Go app on your device:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Scan the QR code displayed in the terminal or browser

## Configuration

### Backend Server (Optional)

To connect the app to a backend server for cloud features:

1. Create a `.env` file in the root directory:
```
API_URL=https://your-server.com/api
CLOUD_STORAGE_URL=https://your-storage.com
```

2. Update the service files to use these environment variables

### Firebase (Optional)

For cloud storage and authentication:

1. Create a Firebase project at https://console.firebase.google.com
2. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
3. Place them in the appropriate directories
4. Install Firebase SDK:
```bash
npm install firebase
```

## Troubleshooting

### Issue: Metro bundler fails to start

**Solution**: Clear cache and restart
```bash
npm start -- --reset-cache
```

### Issue: Camera not working

**Solution**: Ensure permissions are granted in device settings

### Issue: TensorFlow errors

**Solution**: 
1. Clear node modules and reinstall:
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

2. Make sure you're using a compatible version of React Native

### Issue: Build fails on iOS

**Solution**:
1. Run pod install:
```bash
cd ios && pod install && cd ..
```

2. Clean build:
```bash
cd ios && xcodebuild clean && cd ..
```

### Issue: Cannot find module errors

**Solution**: Ensure all dependencies are installed:
```bash
npm install --legacy-peer-deps
```

## Development Tips

### Testing

- Test camera functionality on a physical device (camera doesn't work on simulators)
- Use the web version for UI development
- Test with various waste images for classification

### Debugging

1. Enable Remote JS Debugging:
   - Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
   - Select "Debug JS Remotely"

2. Use React Native Debugger:
```bash
npm install -g react-native-debugger
```

### Performance

- Keep TensorFlow model lightweight for mobile devices
- Optimize images before classification
- Use AsyncStorage efficiently
- Implement pagination for history list

## Building for Production

### iOS

1. Configure app identifier in `app.json`
2. Build the app:
```bash
expo build:ios
```

3. Submit to App Store using Application Loader

### Android

1. Configure package name in `app.json`
2. Build the app:
```bash
expo build:android
```

3. Upload the APK to Google Play Console

## Next Steps

1. Implement backend API for cloud features
2. Set up Firebase for authentication
3. Add real TensorFlow model trained on waste images
4. Configure push notifications
5. Set up analytics

## Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation in README.md
- Review the code comments in service files

## Resources

- Expo Documentation: https://docs.expo.dev
- React Native: https://reactnative.dev
- TensorFlow.js: https://www.tensorflow.org/js
- React Navigation: https://reactnavigation.org
