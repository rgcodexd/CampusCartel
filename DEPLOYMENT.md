# Campus Exchange - Deployment Guide

This guide will help you deploy the Campus Exchange app and generate APK files for distribution.

## Prerequisites

1. **Expo CLI**: Install globally
   ```bash
   npm install -g @expo/cli
   ```

2. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   ```

3. **Firebase Project**: Set up a Firebase project and get your configuration

4. **Expo Account**: Create an account at [expo.dev](https://expo.dev)

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Enable Storage
6. Get your configuration from Project Settings

### 3. EAS Setup

1. Login to EAS:
   ```bash
   eas login
   ```

2. Initialize EAS in your project:
   ```bash
   eas build:configure
   ```

3. Update the `eas.json` file with your project ID:
   ```json
   {
     "extra": {
       "eas": {
         "projectId": "your-actual-project-id"
       }
     }
   }
   ```

## Building the App

### Development Build

For testing on your device:

```bash
npm run dev
```

### Preview Build (APK)

To generate an APK for testing:

```bash
npm run build:android
```

This will create an APK file that you can download and install on Android devices.

### Production Build

For production release:

```bash
npm run build:android-prod
```

This creates an AAB (Android App Bundle) for Google Play Store.

## Deployment Options

### 1. Internal Testing (APK)

1. Run the preview build:
   ```bash
   npm run build:android
   ```

2. Download the APK from the EAS dashboard
3. Share the APK file with testers
4. Testers can install directly on their devices

### 2. Google Play Store

1. Create a production build:
   ```bash
   npm run build:android-prod
   ```

2. Download the AAB file
3. Upload to Google Play Console
4. Follow Google Play Store submission process

### 3. Web Deployment

For web version:

```bash
npm run build:web
```

This creates a static web build that can be deployed to any hosting service.

## Build Configuration

### Android Configuration

The app is configured with the following Android settings:

- **Package Name**: `com.campusexchange.app`
- **Version Code**: 1
- **Permissions**: Camera, Storage, Location, Internet
- **Build Type**: APK for testing, AAB for production

### iOS Configuration

For iOS builds:

- **Bundle Identifier**: `com.campusexchange.app`
- **Build Number**: 1.0.0
- **Permissions**: Camera, Photo Library, Location

## Troubleshooting

### Common Issues

1. **Build Fails**: Check your Firebase configuration and environment variables
2. **APK Too Large**: Optimize images and remove unused dependencies
3. **Permission Errors**: Ensure all required permissions are in app.json

### Build Commands Reference

```bash
# Development
npm start                    # Start development server
npm run android             # Run on Android emulator
npm run ios                 # Run on iOS simulator
npm run web                 # Run on web browser

# Building
npm run build:android       # Build APK for testing
npm run build:android-prod  # Build AAB for production
npm run build:ios           # Build for iOS testing
npm run build:web           # Build for web deployment

# Quality Checks
npm run lint                # Run ESLint
npm run type-check          # Run TypeScript checks
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Firebase Rules**: Set up proper Firestore and Storage security rules
3. **API Keys**: Use environment variables for all sensitive data
4. **Code Obfuscation**: Consider enabling code obfuscation for production builds

## Performance Optimization

1. **Image Optimization**: Compress images before uploading
2. **Bundle Size**: Monitor and optimize bundle size
3. **Caching**: Implement proper caching strategies
4. **Lazy Loading**: Use lazy loading for images and components

## Monitoring and Analytics

Consider adding:

1. **Crash Reporting**: Firebase Crashlytics
2. **Analytics**: Firebase Analytics
3. **Performance Monitoring**: Firebase Performance Monitoring
4. **User Feedback**: In-app feedback system

## Support

For issues and questions:

1. Check the [Expo Documentation](https://docs.expo.dev/)
2. Review [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
3. Check Firebase Console for backend issues
4. Review app logs in EAS dashboard

## Next Steps

After successful deployment:

1. Set up monitoring and analytics
2. Implement user feedback system
3. Plan feature updates and maintenance
4. Consider implementing CI/CD pipeline
5. Set up automated testing 