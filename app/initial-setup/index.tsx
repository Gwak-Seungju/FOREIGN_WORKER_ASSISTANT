import CustomDropdown from '@/components/CustomDropdown';
import i18n from '@/i18n';
import { useCountryStore } from '@/stores/countryStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export function LanguageDropdown({
  value,
  setValue
}: {
  value: string | null,
  setValue: React.Dispatch<React.SetStateAction<string | null>> | React.Dispatch<React.SetStateAction<string>>
}) {
  const items = [
    { label: '한국어', value: 'ko' },
    { label: 'English', value: 'en' },
    { label: 'ภาษาไทย', value: 'th' },
    { label: 'Tiếng Việt', value: 'vi' },
  ];

  return (
    <View style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000, width: 120 }}>
      <CustomDropdown
        items={items}
        value={value}
        onChange={async (lang) => {
          setValue(lang);
          i18n.changeLanguage(lang);
          await AsyncStorage.setItem('language', lang);
        }}
        placeholder="Language"
        showTickIcon={false}
        boldSelected
      />
    </View>
  );
}

export default function InitialSetupScreen() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [hasJob, setHasJob] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const [showVisaModal, setShowVisaModal] = useState(false);
  const router = useRouter();
  const { setCountry: setNationality } = useCountryStore();

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

  const items = [
    {label: t('country.vietnam'), value: 'vietnam'},
    {label: t('country.thailand'), value: 'thailand'}
  ]

  return (
    <View style={styles.container}>
      {/* Step 1: 국가 선택 */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.question}>{t('initialSetup.question1')}</Text>
          <Image
            source={require('@/assets/images/globe.png')} 
            style={styles.image}
          />
          <LanguageDropdown value={value} setValue={setValue}/>
          <View style={styles.countryDropdown}>
            <CustomDropdown
              items={items}
              value={country}
              onChange={async (cty) => {
                setCountry(cty);
                setNationality(cty);
                await AsyncStorage.setItem('country', cty);
              }}
              placeholder={t('Country')}
              showTickIcon={false}
              boldSelected
              dropDownStyle={{
                borderColor: '#000',
                borderWidth: 0,
                borderRadius: 8,
                backgroundColor: '#fff',
                width: 120,
              }}
              containerStyle={{
                borderColor: '#000',
                borderWidth: 1,
                borderRadius: 8,
                backgroundColor: '#fff',
                width: 120,
              }}
              style={{borderWidth: 1, borderColor: '#000', width: 120}}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, !country && styles.disabled]}
            disabled={!country}
            onPress={() => setStep(2)}
          >
            <Text style={styles.buttonText}>{t('common.next')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: 한국 취업 여부 */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <TouchableOpacity onPress={() => setStep(step - 1)} style={{ position: 'absolute', top: 20, left: 10, zIndex: 10 }}>
            <Text style={{ fontSize: 28, color: '#222' }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.question}>{t('initialSetup.question2')}</Text>
          <Image
            source={require('@/assets/images/korea-employment.png')} 
            style={styles.image}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => handleHasJob(true)}>
              <Text style={styles.buttonText}>{t('common.yes')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleHasJob(false)}>
              <Text style={styles.buttonText}>{t('common.no')}</Text>
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
                    {hasJob ? t('initialSetup.modalTitle.hasJob') : t('initialSetup.modalTitle.noJob')}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {hasJob
                      ? t('initialSetup.modalSubtitle.hasJob')
                      : t('initialSetup.modalSubtitle.noJob')}
                  </Text>
                  <View style={styles.modalButtonGroup}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>{t('common.close')}</Text>
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
                        {hasJob ? t('initialSetup.moveToMain') : t('initialSetup.moveToNext')}
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
          <Text style={styles.question}>{t('initialSetup.question3')}</Text>
          <Image
            source={require('@/assets/images/visa.png')} 
            style={styles.image}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => handleVisaSelect('E-9')}>
              <Text style={styles.buttonText}>{t('initialSetup.visaE9')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.disabled]} disabled>
              <Text style={styles.buttonText}>{t('initialSetup.visaH2')}</Text>
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
                <Text style={styles.modalTitle}>{t('initialSetup.visaModalTitle')}</Text>
                <Text style={styles.modalSubtitle}>
                  {t('initialSetup.visaModalSubtitle')}
                </Text>
                <View style={styles.modalButtonGroup}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowVisaModal(false)}
                  >
                    <Text style={styles.modalButtonText}>{t('common.close')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryModalButton}
                    onPress={async () => {
                      await AsyncStorage.setItem('@initial_setup_complete', 'true');
                      setShowVisaModal(false);
                      router.replace('/onboarding');
                    }}
                  >
                    <Text style={styles.primaryModalButtonText}>{t('common.proceed')}</Text>
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
  countryDropdown: {
    alignSelf: 'center',
    position: 'relative',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
    maxWidth: 180,
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    flexWrap: 'wrap',
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