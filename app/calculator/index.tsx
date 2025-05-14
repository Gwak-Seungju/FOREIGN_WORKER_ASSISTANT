import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useCountryStore } from '@/stores/countryStore';
import axios from 'axios';

const costItems = [
  { id: 'passport', label: '여권 발급 비용' },
  { id: 'document', label: '서류 발급 비용' },
  { id: 'medical', label: '종합 검진 비용' },
  { id: 'visa', label: '비자 신청 수수료' },
  { id: 'eps', label: 'EPS-TOPIK 응시료' },
  { id: 'flight', label: '항공료' },
];

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
  viasFee: number;
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
  const { nationality } = useCountryStore();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [result, setResult] = useState<EstimateResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchEstimatedCost('TH', {
        passport: selectedItems.includes('passport'),
        document: selectedItems.includes('document'),
        medical: selectedItems.includes('medical'),
        visa: selectedItems.includes('visa'),
        epsExam: selectedItems.includes('eps'),
        airfare: selectedItems.includes('flight'),
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>대략적인 비용을 계산해드립니다!</Text>

      {costItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[styles.checkboxRow, selectedItems.includes(item.id) && styles.checked]}
          onPress={() => toggleItem(item.id)}
        >
          <Text style={styles.checkbox}>{selectedItems.includes(item.id) ? '✅' : '⬜️'}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {result && (
        <View style={styles.estimateContainer}>
          <Text style={styles.estimateLabel}>약 {result.totalCost}{nationality === '태국' ? '฿' : '₫'} 예상</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checked: {
    opacity: 0.8,
  },
  checkbox: {
    fontSize: 20,
  },
  label: {
    fontSize: 16,
  },
  estimateContainer: {
    marginTop: 24,
  },
  estimateLabel: {
    fontSize: 20,
    fontWeight: '500',
  },
});