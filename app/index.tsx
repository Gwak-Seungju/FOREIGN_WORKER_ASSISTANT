import HomeScreen from '@/screens/HomeScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';
import { Redirect } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import '../i18n';

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

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('inset-swipe'); // swipe 가능
      SystemUI.setBackgroundColorAsync('transparent'); // 배경 투명하게

      // 강제로 immersive 적용
      NavigationBar.setPositionAsync('absolute');
    }
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