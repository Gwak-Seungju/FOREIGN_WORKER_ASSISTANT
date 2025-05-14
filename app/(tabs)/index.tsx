import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LanguageDropdown } from '../initial-setup';

export default function TabLayout() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [items, setItems] = useState([
    { label: 'English', value: 'en' },
    { label: '한국어', value: 'ko' },
    { label: 'ไทย', value: 'th' },
    { label: 'Tiếng Việt', value: 'vi' },
  ]);

  const [initialSetupDone, setInitialSetupDone] = useState<boolean | null>(null);

  useEffect(() => {
    const checkInitialSetup = async () => {
      const isInitialSetup = await AsyncStorage.getItem('@initial_setup_complete');
      setInitialSetupDone(!!isInitialSetup);
    };
    checkInitialSetup();
  }, []);

  useEffect(() => {
    const checkInitialSetup = async () => {
      const language = await AsyncStorage.getItem('language');
      if (language) {
        setLanguage(language);
        i18n.changeLanguage(language);
      }
    };
    checkInitialSetup();
  }, []);

  if (initialSetupDone === false) {
    return <Redirect href="/initial-setup" />;
  }

  if (initialSetupDone === null) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LanguageDropdown value={language} setValue={setLanguage} />
      <Text style={styles.title}>{t('home.title')}</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      <Text style={styles.description}>{t('home.description')}</Text>

      <View style={styles.featureGrid}>
        <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/calculator')}>
          <View style={[styles.featureIcon, { backgroundColor: '#E0F0FF' }]}>
            <Ionicons name="calculator" size={40} color={'#dadada'} />
          </View>
          <Text style={styles.featureTitle}>{t('home.calculator')}</Text>
          <Text style={styles.featureSubtitle}>{t('home.calculator_subtitle')}</Text>
          <Text style={styles.featureDescription}>{t('home.calculator_description')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/onboarding')}>
          <View style={[styles.featureIcon, { backgroundColor: '#E6F7E6' }]}>
            <Ionicons name="checkmark-done" size={40} color={'#dadada'} />
          </View>
          <Text style={styles.featureTitle}>{t('home.onboarding')}</Text>
          <Text style={styles.featureSubtitle}>{t('home.onboarding_subtitle')}</Text>
          <Text style={styles.featureDescription}>{t('home.onboarding_description')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.featureCard, { width: '100%' }]} onPress={() => router.push('/chatbot')}>
          <View style={[styles.featureIcon, { backgroundColor: '#FFF2CC' }]}>
          <Ionicons name="chatbubble-ellipses" size={40} color={'#dadada'} />
          </View>
          <Text style={styles.featureTitle}>{t('home.chatbot')}</Text>
          <Text style={styles.featureSubtitle}>{t('home.chatbot_subtitle')}</Text>
          <Text style={styles.featureDescription}>{t('home.chatbot_description')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
    columnGap: 12,
  },
  featureCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 13,
    color: '#000',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
  },
  featureRow: {
    gap: 20,
    alignItems: 'center',
  },
  circle: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
});