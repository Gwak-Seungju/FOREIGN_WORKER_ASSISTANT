import { useNavigationContainerRef, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function IndexRedirect() {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/(tabs)');
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}