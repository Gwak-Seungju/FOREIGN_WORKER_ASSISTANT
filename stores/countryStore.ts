import { create } from 'zustand';

interface UserState {
  nationality: string;
  setNationality: (value: string) => void;
}

export const useCountryStore = create<UserState>((set) => ({
  nationality: '',
  setNationality: (value: string) => set({ nationality: value }),
}));