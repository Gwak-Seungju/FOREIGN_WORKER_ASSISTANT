import i18n from '@/i18n';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DropDownPicker
        open={open}
        value={language}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newLang = callback(language);
          setLanguage(newLang);
          i18n.changeLanguage(newLang);
        }}
        setItems={setItems}
        containerStyle={{
          width: 120,
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
        }}
        style={{
          minHeight: 36,
          borderRadius: 8,
        }}
        dropDownContainerStyle={{
          position: 'absolute',
          top: 35,
          right: 0,
          width: 120,
          zIndex: 10,
        }}
        listItemContainerStyle={{
          height: 36
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
      <Text style={styles.title}>{t('home.title')}</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      <Text style={styles.description}>{t('home.description')}</Text>

      <View style={styles.featureRow}>
        <TouchableOpacity style={styles.circle} onPress={() => router.push('/calculator')}>
          <Image source={require('@/assets/images/adaptive-icon.png')} style={styles.icon} />
          <Text style={styles.label}>{t('home.calculator')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={() => router.push('/onboarding')}>
          <Image source={require('@/assets/images/adaptive-icon.png')} style={styles.icon} />
          <Text style={styles.label}>{t('home.onboarding')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={() => router.push('/chatbot')}>
          <Image source={require('@/assets/images/adaptive-icon.png')} style={styles.icon} />
          <Text style={styles.label}>{t('home.chatbot')}</Text>
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