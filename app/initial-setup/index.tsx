import CustomDropdown from '@/components/CustomDropdown';
import { useCountryStore } from '@/stores/countryStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InitialSetupScreen() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [hasJob, setHasJob] = useState<boolean | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const router = useRouter();
  const { setNationality } = useCountryStore();

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
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.question}>어느 나라에 거주하시나요?</Text>
          <Image
            source={require('@/assets/images/globe.png')} 
            style={styles.image}
          />
          <CustomDropdown
            selected={country}
            setSelected={(itemValue) => {
              setCountry(itemValue);
              setNationality(itemValue);
            }}
            options={['필리핀', '태국']}
          />
          <TouchableOpacity
            style={[styles.button, !country && styles.disabled]}
            disabled={!country}
            onPress={() => setStep(2)}
          >
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: 한국 취업 여부 */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.question}>이미 한국 취업을 완료하셨나요?</Text>
          <Image
            source={require('@/assets/images/korea-employment.png')} 
            style={styles.image}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => setHasJob(true)}>
              <Text style={styles.buttonText}>예</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setHasJob(false)}>
              <Text style={styles.buttonText}>아니오</Text>
            </TouchableOpacity>
          </View>
          {hasJob !== null && (
            <>
              <Text style={styles.infoText}>
                {hasJob ? '한국 적응을 도와드릴게요!' : '지금부터 도와드릴게요!'}
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
                <Text style={styles.buttonText}>{hasJob ? '메인화면으로': '다음으로'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* Step 3: 비자 선택 */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.question}>어떤 비자를 취득할 예정인가요?</Text>
          <Image
            source={require('@/assets/images/visa.png')} 
            style={styles.image}
          />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: 320,
    height: 320,
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
    margin: 12,
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