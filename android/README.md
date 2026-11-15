# Essential Core for Android

Native Android companion and reusable UI foundation for the Essential Core React playground.

## Liquid-drop navigation

- Kotlin + Jetpack Compose navigation component with three reusable destinations.
- One persistent glass lens travels between destinations with a spring animation.
- AGSL runtime shader and Android RenderEffect on Android 13+ for GPU-rendered optical treatment.
- Translucent Compose fallback on Android 8.0–12.
- The native Android component is separate from the React web playground; Android's system graphics APIs are not available to a browser page.

The shader is at `app/src/main/res/raw/liquid_drop.agsl`.

## Build

From this directory:

```bash
gradle :app:assembleDebug
```

The GitHub Actions workflow also builds the debug APK and uploads it as the `EssentialCore-Android-debug` artifact.

APK output: `app/build/outputs/apk/debug/app-debug.apk`.
