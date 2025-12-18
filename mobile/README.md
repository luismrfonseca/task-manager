# Task Manager Mobile App

This is the mobile client for the Task Manager application, built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/).

## Stack

*   **Framework**: Expo (SDK 54)
*   **Language**: TypeScript
*   **State Management**: Zustand
*   **Data Fetching**: TanStack React Query
*   **Networking**: Axios
*   **Storage**: Async Storage & Expo Secure Store
*   **UI**: React Native, Expo Linear Gradient, React Native SVG

## Prerequisites

*   Node.js (LTS)
*   Expo Go app on your physical device (iOS/Android) OR Android Studio (Emulator)

## Installation

```bash
npm install
```

## Running the app

Start the development server:

```bash
npm start
```

This will run `expo start`. You can then:
*   Scan the QR code with your phone (using Expo Go).
*   Press `a` to open in Android Emulator.
*   Press `w` to open in Web browser.

## Configuration

*   **App Config**: `app.json`
*   **Package Name**: `com.taskmanager.app`

## Key Libraries

*   `@tanstack/react-query`: Server state management.
*   `zustand`: Global client state.
*   `expo-notifications`: Handling push notifications.
*   `axios`: HTTP client.
