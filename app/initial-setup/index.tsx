import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InitialSetupScreen() {
  const [country, setCountry] = useState('');
  const [hasJob, setHasJob] = useState<boolean | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const router = useRouter();

  const handleVisaSelect = async (visa: string) => {
    setSelectedVisa(visa);
    if (visa === 'E-9') {
      await AsyncStorage.setItem('@initial_setup_complete', 'true');
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      {/* Step 1: 국가 선택 */}
      {!country && (
        <View style={styles.stepContainer}>
          <Text style={styles.question}>어느 나라에 거주하시나요?</Text>
          <Image source={require('@/assets/onboarding/onboarding1.png')} style={styles.image} />
          <Picker
            selectedValue={country}
            onValueChange={(itemValue) => setCountry(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="국가를 선택하세요" value="" />
            <Picker.Item label="필리핀" value="Philippines" />
            <Picker.Item label="베트남" value="Vietnam" />
            <Picker.Item label="인도네시아" value="Indonesia" />
          </Picker>
        </View>
      )}

      {/* Step 2: 한국 취업 여부 */}
      {country && hasJob === null && (
        <View style={styles.stepContainer}>
          <Text style={styles.question}>이미 한국 취업을 완료하셨나요?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => setHasJob(true)}>
              <Text style={styles.buttonText}>예</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setHasJob(false)}>
              <Text style={styles.buttonText}>아니오</Text>
            </TouchableOpacity>
          </View>
          {hasJob !== null && (
            <Text style={styles.infoText}>
              {hasJob ? '한국 적응을 도와드릴게요!' : '지금부터 도와드릴게요!'}
            </Text>
          )}
        </View>
      )}

      {/* Step 3: 비자 선택 */}
      {country && hasJob !== null && !selectedVisa && (
        <View style={styles.stepContainer}>
          <Text style={styles.question}>어떤 비자를 취득할 예정인가요?</Text>
          <Image source={require('@/assets/onboarding/onboarding1.png')} style={styles.image} />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => handleVisaSelect('E-9')}>
              <Text style={styles.buttonText}>E-9 (비한국계 외국인)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.disabled]} disabled>
              <Text style={styles.buttonText}>H-2 (한국계 외국인)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  picker: {
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: 'white',
  },
  infoText: {
    marginTop: 16,
    fontSize: 14,
    color: '#555',
  },
});