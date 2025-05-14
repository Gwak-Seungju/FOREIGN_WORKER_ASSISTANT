import CustomDropdown from '@/components/CustomDropdown';
import { useCountryStore } from '@/stores/countryStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function InitialSetupScreen() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [hasJob, setHasJob] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const [showVisaModal, setShowVisaModal] = useState(false);
  const router = useRouter();
  const { setNationality } = useCountryStore();

  const handleVisaSelect = async (visa: string) => {
    setSelectedVisa(visa);
    if (visa === 'E-9') {
      setShowVisaModal(true);
    }
  };

  const handleHasJob = (value: boolean) => {
    setHasJob(value);
    setModalVisible(true);
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
            options={['베트남', '태국']}
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
          <TouchableOpacity onPress={() => setStep(step - 1)} style={{ position: 'absolute', top: 20, left: 10, zIndex: 10 }}>
            <Text style={{ fontSize: 28, color: '#222' }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.question}>이미 한국 취업을 완료하셨나요?</Text>
          <Image
            source={require('@/assets/images/korea-employment.png')} 
            style={styles.image}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => handleHasJob(true)}>
              <Text style={styles.buttonText}>예</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleHasJob(false)}>
              <Text style={styles.buttonText}>아니오</Text>
            </TouchableOpacity>
          </View>
          <Modal visible={modalVisible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.modalContainer}
                  onPress={() => {}}
                >
                  <Text style={styles.modalTitle}>
                    {hasJob ? '메인 화면으로 이동하세요' : '다음 단계로 이동하세요'}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {hasJob
                      ? '한국 적응을 위한 다양한 서비스를 제공합니다.'
                      : '한국 취업에 대해 알아가기 위해\n한 단계만을 남겨놓고 있습니다!'}
                  </Text>
                  <View style={styles.modalButtonGroup}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>닫기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.primaryModalButton}
                      onPress={async () => {
                        if (hasJob) {
                          await AsyncStorage.setItem('@initial_setup_complete', 'true');
                          router.replace('/');
                        } else {
                          setModalVisible(false);
                          setStep(3);
                        }
                      }}
                    >
                      <Text style={styles.primaryModalButtonText}>
                        {hasJob ? '메인화면으로' : '다음으로'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}

      {/* Step 3: 비자 선택 */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <TouchableOpacity onPress={() => setStep(step - 1)} style={{ position: 'absolute', top: 20, left: 10, zIndex: 10 }}>
            <Text style={{ fontSize: 28, color: '#222' }}>←</Text>
          </TouchableOpacity>
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
      {showVisaModal && (
        <Modal visible transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowVisaModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.modalContainer}
                onPress={() => {}}
              >
                <Text style={styles.modalTitle}>온보딩 페이지로 이동합니다</Text>
                <Text style={styles.modalSubtitle}>
                  온보딩 절차를 따라 한국 취업에 성공하시길 바랍니다.
                </Text>
                <View style={styles.modalButtonGroup}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowVisaModal(false)}
                  >
                    <Text style={styles.modalButtonText}>닫기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryModalButton}
                    onPress={async () => {
                      await AsyncStorage.setItem('@initial_setup_complete', 'true');
                      setShowVisaModal(false);
                      router.replace('/onboarding');
                    }}
                  >
                    <Text style={styles.primaryModalButtonText}>이동하기</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    flex: 1,
    justifyContent: 'center',
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 12,
    width: '100%',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
  },
  primaryModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007bff',
    marginLeft: 8,
  },
  modalButtonText: {
    color: '#000',
    textAlign: 'center',
  },
  primaryModalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});