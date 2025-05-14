import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';

type CountryState = {
  country: string;
  setCountry: (country: string) => void;
};

// ✅ 기본 store 생성 로직
const createStore = () => {
  return (set: any) => ({
    country: '',
    setCountry: (country: string) => set({ country }),
  });
};

let useCountryStore: any;

if (Platform.OS !== 'web') {
  const { persist, createJSONStorage } = require('zustand/middleware');
  useCountryStore = create<CountryState>()(
    persist(createStore(), {
      name: 'user_country',
      storage: createJSONStorage(() => AsyncStorage),
    })
  );
} else {
  useCountryStore = create<CountryState>()(createStore());
}

export { useCountryStore };
