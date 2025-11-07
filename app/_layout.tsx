import { AuthProvider } from '@/src/contexts/AuthContext';
import { apolloClient } from '@/src/utils/apollo-client';
import { ApolloProvider } from '@apollo/client/react';
import { Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Cinzel-Regular': Cinzel_400Regular,
    'Cinzel-Bold': Cinzel_700Bold,
    'Lora-Regular': Lora_400Regular,
    'Lora-Bold': Lora_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </AuthProvider>
    </ApolloProvider>
  );
}
