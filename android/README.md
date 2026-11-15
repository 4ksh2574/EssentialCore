# Essential Core for Android

Native Android companion to the Essential Core React playground.

- Kotlin + Jetpack Compose reusable LiquidDropNavigation component.
- AGSL runtime shader on Android 13+ refracts content behind the selected glass drop.
- Spring-driven movement between navigation destinations.
- Translucent fallback on Android 8.0–12.

The shader is at app/src/main/res/raw/liquid_drop.agsl.

Build from this folder with: gradle :app:assembleDebug

APK output: app/build/outputs/apk/debug/app-debug.apk
