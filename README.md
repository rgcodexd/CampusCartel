# Campus Exchange App

A React Native/Expo application for buying, selling, and renting items between college students.

## Features

- **Product Listings**: Browse and search for items by category
- **Add Items**: List your own items for sale or rent
- **Messaging**: Chat with other users about items
- **User Profiles**: Manage your profile and listings
- **Search & Filters**: Advanced search with multiple filter options
- **Real-time Updates**: Live updates for messages and listings

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **Backend**: Firebase (Firestore, Storage, Auth)
- **UI Components**: Custom components with Lucide React Native icons
- **State Management**: React hooks and context
- **TypeScript**: Full type safety

## Recent Fixes and Improvements

### 1. Firebase Configuration
- **Issue**: Hardcoded demo Firebase configuration
- **Fix**: Added environment variable support for production deployment
- **Improvement**: Better error handling for Firebase initialization

### 2. Error Handling
- **Issue**: Inconsistent error handling across the app
- **Fix**: Created comprehensive error handling utility (`utils/errorHandling.ts`)
- **Improvement**: Centralized error management with specific error types

### 3. Image Loading
- **Issue**: No loading states or error handling for images
- **Fix**: Added loading indicators and fallback images in ProductCard
- **Improvement**: Better user experience with visual feedback

### 4. Data Validation
- **Issue**: Limited input validation
- **Fix**: Enhanced validation utilities with comprehensive checks
- **Improvement**: Better data integrity and user feedback

### 5. Type Safety
- **Issue**: Some type assertions and missing type definitions
- **Fix**: Improved TypeScript configurations and type definitions
- **Improvement**: Better development experience and fewer runtime errors

### 6. Performance
- **Issue**: No caching or optimization utilities
- **Fix**: Added performance utilities for caching and optimization
- **Improvement**: Better app performance and user experience

## Project Structure

```
collge/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── search.tsx     # Search screen
│   │   ├── add.tsx        # Add item screen
│   │   ├── chat.tsx       # Messages screen
│   │   └── profile.tsx    # Profile screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ProductCard.tsx    # Product display component
│   └── CategoryButton.tsx # Category filter component
├── services/             # API and external services
│   ├── firebase.ts       # Firebase configuration
│   ├── products.ts       # Product-related API calls
│   └── auth.ts           # Authentication services
├── utils/                # Utility functions
│   ├── validation.ts     # Input validation
│   ├── location.ts       # Location utilities
│   ├── errorHandling.ts  # Error handling utilities
│   └── performance.ts    # Performance optimization
├── types/                # TypeScript type definitions
│   └── index.ts          # Main type definitions
└── hooks/                # Custom React hooks
    └── useFrameworkReady.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd collge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Firebase configuration:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

## Key Components

### ProductCard
Enhanced with:
- Loading states for images
- Error handling with fallback images
- Better touch feedback
- Improved accessibility

### Validation System
Comprehensive validation for:
- Email addresses (including college email validation)
- Phone numbers
- Product information
- Location data
- Image URLs

### Error Handling
Centralized error management with:
- Custom error classes
- Firebase-specific error messages
- Network error handling
- User-friendly error messages

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error boundaries

### Testing
- Test components in isolation
- Validate user inputs
- Test error scenarios
- Performance testing for large lists

### Performance
- Use the provided caching utilities
- Implement proper list virtualization
- Optimize image loading
- Monitor memory usage

## Deployment

### Web
```bash
npm run build:web
```

### Mobile
1. Configure app.json with your app details
2. Build for production:
```bash
expo build:android  # for Android
expo build:ios      # for iOS
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 