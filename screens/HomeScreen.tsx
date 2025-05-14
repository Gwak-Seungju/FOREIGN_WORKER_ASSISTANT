import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const resetOnboarding = () => {
    try {
      router.push('/onboarding');
    } catch (err) {
      console.log('Error @removeItem: ', err);
    }
  };

  const goChatbot = () => {
    try {
      router.push('/chatbot');
    } catch (err) {
      console.log('Error @removeItem: ', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>WorkerBridge</Text>
      <Text style={styles.subtitle}>Your gateway to a career in Korea</Text>
      <Text style={styles.description}>
        We&apos;re here to help you navigate the Korean job market, from resume building to interview tips.
      </Text>

      <View style={styles.featureRow}>
        <TouchableOpacity style={styles.circle} onPress={() => router.push('/calculator')}>
          <Image source={require('@/assets/images/adaptive-icon.png')} style={styles.icon} />
          <Text style={styles.label}>Cost Estimator</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={() => router.push('/onboarding')}>
          <Image source={require('@/assets/images/adaptive-icon.png')} style={styles.icon} />
          <Text style={styles.label}>Checklist Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={() => router.push('/chatbot')}>
          <Image source={require('@/assets/images/adaptive-icon.png')} style={styles.icon} />
          <Text style={styles.label}>Chatbot Support</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={resetOnboarding}
      >
        <Text style={styles.buttonText}>온보딩 다시보기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={goChatbot}
      >
        <Text style={styles.buttonText}>챗봇</Text>
      </TouchableOpacity>
      <Text>{t('ask')}</Text>
      <Button
        title="English"
        onPress={() => i18n.changeLanguage('en')}
      />
      <Button
        title="한국어"
        onPress={() => i18n.changeLanguage('ko')}
      />
      <Button
        title="태국어"
        onPress={() => i18n.changeLanguage('th')}
      />
      <Button
        title="베트남어"
        onPress={() => i18n.changeLanguage('vi')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#e9f1f8',
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