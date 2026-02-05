# EcoSorterAI

Eco-Sorter AI is a mobile application for Android and iOS that uses artificial intelligence to help users classify and sort waste properly. The app leverages on-device machine learning with TensorFlow to identify different types of waste through camera captures.

## Features

✅ **Image-Based Waste Classification**
- Use your device camera to capture images of waste items
- Local AI model powered by TensorFlow for real-time classification
- Identifies waste categories: Organic and Inorganic

✅ **Accurate Self-Identification**
- Records the software's prediction accuracy
- Confidence scores for each classification
- High-confidence predictions stored as training data

✅ **Cloud Integration**
- Low-confidence images automatically sent to server for supplementary analysis
- Cloud storage for historical images
- Data synchronization across devices

✅ **Advanced Features**
- Filter and search through classification history
- User ranking system based on scanning activity
- User authentication and profiles
- Points and achievements system

✅ **TensorFlow Model Training**
- On-device model training with collected data
- Continuous learning from user feedback
- Model export and deployment capabilities
- Automatic retraining when sufficient data is collected

## Technology Stack

- **Framework**: React Native with Expo
- **AI/ML**: TensorFlow.js for React Native
- **Storage**: AsyncStorage for local data, cloud storage integration ready
- **Camera**: Expo Camera and Image Picker
- **Navigation**: React Navigation
- **UI**: React Native components with custom styling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ducduyhsme/EcoSorterAI.git
cd EcoSorterAI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## Project Structure

```
EcoSorterAI/
├── App.js                      # Main application entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies and scripts
├── babel.config.js             # Babel configuration
├── assets/                     # App icons and splash screens
├── src/
│   ├── screens/               # Application screens
│   │   ├── LoginScreen.js     # User authentication
│   │   ├── CameraScreen.js    # Camera and scanning
│   │   ├── HistoryScreen.js   # Classification history
│   │   ├── RankingScreen.js   # User rankings
│   │   └── ProfileScreen.js   # User profile
│   ├── services/              # Business logic services
│   │   ├── aiService.js       # TensorFlow model and classification
│   │   ├── storageService.js  # Local and cloud storage
│   │   ├── rankingService.js  # User ranking system
│   │   └── trainingService.js # Model training utilities
│   ├── components/            # Reusable components
│   ├── utils/                 # Utility functions
│   └── models/                # Data models
└── README.md
```

## How It Works

1. **Capture Image**: User captures or selects an image of waste using the camera
2. **AI Classification**: TensorFlow model analyzes the image and predicts the waste category
3. **Confidence Check**: 
   - High confidence (≥70%): Result saved locally and added to training data if ≥80%
   - Low confidence (<70%): Image sent to server for better classification
4. **Storage**: Classification results stored locally with cloud sync capability
5. **Training**: Collected data used to retrain and improve the model
6. **Ranking**: Users earn points for each scan, competing on the leaderboard

## TensorFlow Model

The app uses a Convolutional Neural Network (CNN) built with TensorFlow.js:

- **Input**: 224x224 RGB images
- **Architecture**: 
  - 3 Convolutional layers with MaxPooling
  - Flatten layer
  - Dense layer (128 units)
  - Dropout (0.5)
  - Output layer (2 categories with softmax)
- **Training**: Adam optimizer, categorical crossentropy loss
- **Features**: On-device training, model persistence, automatic retraining

## API Integration

The app is designed to integrate with a backend server for:
- Improved classification for low-confidence predictions
- Cloud storage and sync
- User rankings across all users
- Model updates and improvements

Server endpoints (to be implemented):
- `POST /api/upload` - Upload images for supplementary classification
- `POST /api/sync` - Sync user data with cloud
- `GET /api/rankings` - Fetch global user rankings

## Configuration

Edit `app.json` to configure:
- App name and identifier
- iOS and Android specific settings
- Permissions
- Icon and splash screen

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Future Enhancements

- [ ] Real-time object detection
- [ ] Multi-language support
- [ ] Augmented Reality features
- [ ] Integration with local recycling centers
- [ ] Social sharing features
- [ ] Educational content about waste management
- [ ] Barcode scanning for packaged items
- [ ] Voice feedback for accessibility

## Contact

For questions or support, please open an issue on GitHub.

## Acknowledgments

- TensorFlow.js team for the ML framework
- Expo team for the excellent development platform
- Open source community for various libraries used in this project
