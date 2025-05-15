import { Entypo } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Stack } from "expo-router";
import { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync(Entypo.font)
      .then(() => setFontLoaded(true))
      .catch(console.warn);
  }, []);

  if (!fontLoaded) return null;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
          <Stack.Screen name="chatbot" options={{ headerShown: false}} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="initial-setup" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
