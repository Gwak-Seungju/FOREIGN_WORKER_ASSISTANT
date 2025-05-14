import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
      <Stack.Screen name="chatbot" options={{ headerShown: false}} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="initial-setup" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}
