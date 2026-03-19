import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.raccoova.scriptony',
  appName: 'Scriptony',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For production, point to your API
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    cleartext: process.env.NODE_ENV === 'development',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  // Android-specific
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      // These will be set via environment variables in CI/CD
      keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
      keystoreAliasPassword: process.env.ANDROID_KEYSTORE_ALIAS_PASSWORD,
    },
    // Minimum SDK version
    minSdkVersion: 24,
    // Target SDK version
    targetSdkVersion: 34,
  },
  // iOS-specific
  ios: {
    contentInset: 'automatic',
    // Uses standard iOS 15+ features
    minVersion: '15.0',
    // Scheme for custom URL handling
    scheme: 'scriptony',
    // Enable scroll bouncing (default for iOS)
    scrollEnabled: true,
    // Status bar style
    statusBarStyle: 'dark',
    // Prevents cordova-plugin-inappbrowser issues
    webviewSuspensionEnabled: false,
  },
};

export default config;
