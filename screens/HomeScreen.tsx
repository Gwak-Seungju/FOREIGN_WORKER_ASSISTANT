import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();

  const resetOnboarding = () => {
    try {
      router.replace('/onboarding');
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