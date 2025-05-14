import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>메인 화면</Text>
      <Text style={styles.text}>온보딩이 완료되었습니다!</Text>
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
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
});