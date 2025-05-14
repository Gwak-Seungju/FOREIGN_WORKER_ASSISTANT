import { useCountryStore } from '@/stores/countryStore';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EstimateParams {
  passport: boolean;
  document: boolean;
  medical: boolean;
  visa: boolean;
  epsExam: boolean;
  airfare: boolean;
}

interface detailCost {
  passportFee: number;
  documentFee: number;
  medicalFee: number;
  visaFee: number;
  epsExamFee: number;
  airfare: number;
}

interface EstimateResponse {
  countryCode: string;
  countryName: string;
  totalCost: number;
  currency: string;
  detail: detailCost;
}

const fetchEstimatedCost = async (
  countryCode: string,
  params: EstimateParams
): Promise<EstimateResponse | null> => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/estimate/${countryCode}`, {
      params: {
        passport: params.passport,
        document: params.document,
        medical: params.medical,
        visa: params.visa,
        epsExam: params.epsExam,
        airfare: params.airfare,
      },
    });

    return response.data ?? null;
  } catch (error) {
    console.error('비용 계산 API 오류:', error);
    return null;
  }
};

export default function CalculatorScreen() {
  const { country } = useCountryStore();
  const router = useRouter();
  const countryCode = country === '태국' ? 'TH' : 'VN';

  const { t } = useTranslation();

  const costItems = [
    { id: 'passportFee', label: t('calculator.passportFee') },
    { id: 'documentFee', label: t('calculator.documentFee') },
    { id: 'medicalFee', label: t('calculator.medicalFee') },
    { id: 'visaFee', label: t('calculator.visaFee') },
    { id: 'epsExamFee', label: t('calculator.epsExamFee') },
    { id: 'airfare', label: t('calculator.airfare') },
  ];

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [result, setResult] = useState<EstimateResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchEstimatedCost(countryCode, {
        passport: selectedItems.includes('passportFee'),
        document: selectedItems.includes('documentFee'),
        medical: selectedItems.includes('medicalFee'),
        visa: selectedItems.includes('visaFee'),
        epsExam: selectedItems.includes('epsExamFee'),
        airfare: selectedItems.includes('airfare'),
      });
      setResult(res);
    };

    fetchData();
  }, [selectedItems]);

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <Text style={{ fontSize: 24 }}>←</Text>  
      </TouchableOpacity>
      <ScrollView style={styles.fullScreen} contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('calculator.title')}</Text>
        <Text style={styles.description}>{t('calculator.description')}</Text>

        {costItems.map(item => {
          const feeValue = result?.detail ? result.detail[item.id as keyof detailCost] : null;
          const checked = selectedItems.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.checkboxRow, checked && styles.checked]}
              onPress={() => toggleItem(item.id)}
            >
              <View
                style={[
                  styles.checkboxBase,
                  checked ? styles.checkboxChecked : styles.checkboxUnchecked,
                ]}
              >
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.label}>{item.label}</Text>
              {checked && feeValue !== null && (
                <Text style={styles.feeText}>
                  {feeValue.toLocaleString()}
                  {country === '태국' ? '฿' : '₫'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {result && (
        <View style={styles.fixedEstimateContainer}>
          <Text style={styles.estimateLabel}>
            {t('calculator.estimatedCost', {
              cost: result.totalCost.toLocaleString(),
              currency: country === '태국' ? '฿' : '₫',
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  checked: {
    opacity: 0.8,
  },
  checkboxBase: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxUnchecked: {
    borderColor: '#007aff',
  },
  checkboxChecked: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  label: {
    fontSize: 16,
  },
  feeText: {
    marginLeft: 'auto',
    fontSize: 14,
    color: '#555',
  },
  estimateContainer: {
    marginTop: 24,
  },
  estimateLabel: {
    fontSize: 20,
    fontWeight: '500',
  },
  fixedEstimateContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
});