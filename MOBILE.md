# Capacitor Mobile Build Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Android Studio (for Android)
- Xcode (for iOS)
- Capacitor CLI: `npm install -g @capacitor/cli`

### 1. Build Web App
```bash
npm run build
```

### 2. Sync Capacitor
```bash
npx cap sync
```

### 3. Open Native IDE

**Android:**
```bash
npx cap open android
```

**iOS:**
```bash
npx cap open ios
```

## 📱 Android Build

### Debug APK
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK/AAB
```bash
cd android
./gradlew assembleRelease
# or for Play Store:
./gradlew bundleRelease
```

## 🍎 iOS Build

Open in Xcode:
```bash
npx cap open ios
```

Then in Xcode:
1. Select target device/simulator
2. Product → Build (Cmd+B)
3. Product → Archive (for App Store)

## 🔧 Configuration

### API URL for Mobile
Set in `.env`:
```
VITE_API_URL=https://scriptony.raccoova.com/api
```

Or update `capacitor.config.ts`:
```typescript
server: {
  url: 'https://scriptony.raccoova.com'
}
```

### Icons & Splash Screens

**Generate icons:**
```bash
# Install capacitor-assets
npm install -g @capacitor/assets

# Generate all icons and splash screens
npx capacitor-assets generate --iconBackgroundColor '#ffffff' --splashBackgroundColor '#ffffff'
```

Place source files:
- Icon: `resources/icon.png` (1024x1024)
- Splash: `resources/splash.png` (2732x2732)

## 📦 Live Reload (Development)

### Android
```bash
# In terminal 1:
npm run dev

# In terminal 2:
npx cap run android --livereload --external
```

### iOS
```bash
# In terminal 1:
npm run dev

# In terminal 2:
npx cap run ios --livereload --external
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Build Android
  run: |
    npm run build
    npx cap sync android
    cd android && ./gradlew assembleRelease
```

### Automatic Updates (Capacitor)
```bash
# Install Appflow or use custom OTA
npm install @capacitor/live-updates
```

## 🐛 Troubleshooting

### Android Build Fails
```bash
cd android
./gradlew clean
./gradlew build
```

### CORS Issues on Mobile
Ensure your API allows mobile origins:
```typescript
// In backend CORS config
app.register(cors, {
  origin: ['capacitor://localhost', 'http://localhost'],
})
```

### HTTP not HTTPS on Android
Update `capacitor.config.ts`:
```typescript
android: {
  allowMixedContent: true,
}
```

### iOS Build Errors
```bash
cd ios
pod deintegrate
pod install
```

## 📚 Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Studio Setup](https://capacitorjs.com/docs/android)
- [iOS Setup](https://capacitorjs.com/docs/ios)
- [App Store Publishing](https://capacitorjs.com/docs/ios/deploy-to-app-store)
- [Play Store Publishing](https://capacitorjs.com/docs/android/deploy-to-play-store)

## 🎯 Next Steps

1. Update icons in `resources/`
2. Configure deep linking (custom URL scheme)
3. Set up push notifications
4. Test on physical devices
5. Publish to app stores
