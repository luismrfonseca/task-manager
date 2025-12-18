import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { useAuthStore } from './src/stores/authStore';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, asyncStoragePersister } from './src/api/queryClient';
import { OfflineBanner } from './src/components/OfflineBanner';
import { usePushNotifications } from './src/hooks/usePushNotifications';

import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN_HERE',
  enableInExpoDevelopment: true,
  debug: false,
});

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadUser = useAuthStore((state) => state.loadUser);

  // Initialize Push Notifications
  usePushNotifications();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <StatusBar style="light" />
      <OfflineBanner />
      {isAuthenticated ? <DashboardScreen /> : <LoginScreen />}
    </PersistQueryClientProvider>
  );
}

export default Sentry.Native.wrap(App);
