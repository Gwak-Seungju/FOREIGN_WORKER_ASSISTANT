import HomeScreen from '@/screens/HomeScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [initialSetupDone, setInitialSetupDone] = useState(false);
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);

  useEffect(() => {
    const checkInitial = async () => {
      const isInitialSetup = await AsyncStorage.getItem('@initial_setup_complete');
      const isOnboarding = await AsyncStorage.getItem('@onboarding_complete');
      setInitialSetupDone(!!isInitialSetup);
      setIsOnboardingDone(!!isOnboarding);
      setReady(true);
    };
    checkInitial();
  }, []);

  if (!ready) return null;

  if (!initialSetupDone) {
    return <Redirect href="/initial-setup" />;
  }
  if (!isOnboardingDone) {
    return <OnboardingScreen />
  }

  return (
    <HomeScreen />
  );
}