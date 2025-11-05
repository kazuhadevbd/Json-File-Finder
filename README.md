# json-search-mobile

Bare React Native app to search/filter JSON files on mobile (Android/iOS).

Quick start:
1. npm install
2. npx pod-install ios
3. npx react-native run-android  # or run-ios

Notes:
- Uses react-native-document-picker for file selection and react-native-fs for file IO.
- For large files, use stream parsing (src/services/streamParser.ts).
