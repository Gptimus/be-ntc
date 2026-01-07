import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  scheme: "bentc",
  userInterfaceStyle: "automatic",
  orientation: "default",
  newArchEnabled: true,
  icon: "./assets/images/icons/icon.png",
  web: {
    bundler: "metro",
  },
  name: "Be-ntc",
  slug: "be-ntc",
  plugins: [
    "expo-font",
    "expo-router",
    [
      "expo-localization",
      {
        supportedLocales: {
          ios: ["en", "fr"],
          android: ["en", "fr"],
        },
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/icons/splash-icon-light.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          image: "./assets/images/icons/splash-icon-dark.png",
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        useLegacyPackaging: true,
        android: {
          usesCleartextTraffic: true,
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          useLegacyPackaging: true,
        },
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
        cameraPermission:
          "The app accesses your camera to let you share them with your friends.",
      },
    ],
    [
      "expo-local-authentication",
      {
        faceIDPermission: "Allow $(PRODUCT_NAME) to use Face ID.",
      },
    ],
  ],
  ios: {
    supportsTablet: true,
    icon: {
      light: "./assets/images/icons/ios-light.png",
      dark: "./assets/images/icons/ios-dark.png",
      tinted: "./assets/images/icons/ios-tinted.png",
    },
    bundleIdentifier: "com.bentc.bentc",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icons/adaptive-icon.png",
      monochromeImage: "./assets/images/icons/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.bentc.bentc",
    permissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.USE_BIOMETRIC",
      "android.permission.USE_FINGERPRINT",
    ],
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "a48aebfe-fe2c-49cc-8c78-e0639d46d630",
    },
  },
});
