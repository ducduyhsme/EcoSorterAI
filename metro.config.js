const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver for react-native-fs shim
// This is needed because @tensorflow/tfjs-react-native requires react-native-fs
// but it's not compatible with Expo managed workflow
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-fs': path.resolve(__dirname, 'src/shims/react-native-fs.js'),
};

module.exports = config;
