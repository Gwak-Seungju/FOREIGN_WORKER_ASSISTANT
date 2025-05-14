import { useCountryStore } from '@/stores/countryStore';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const costItems = [
  { id: 'passportFee', label: '여권 발급 비용' },
  { id: 'documentFee', label: '서류 발급 비용' },
  { id: 'medicalFee', label: '종합 검진 비용' },
  { id: 'visaFee', label: '비자 신청 수수료' },
  { id: 'epsExamFee', label: 'EPS-TOPIK 응시료' },
  { id: 'airfare', label: '항공료' },
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
  const { nationality } = useCountryStore();
  const router = useRouter();
  const countryCode = nationality === '태국' ? 'TH' : 'VN';

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
        <Text style={styles.title}>취업 준비 비용 계산</Text>
        <Text style={styles.description}>한국 취업 준비를 위해 소비되는 비용을 대략적으로 계산해드립니다.</Text>

        {costItems.map(item => {
          const feeValue = result?.detail ? result.detail[item.id as keyof detailCost] : null;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.checkboxRow, selectedItems.includes(item.id) && styles.checked]}
              onPress={() => toggleItem(item.id)}
            >
              <Text style={styles.checkbox}>{selectedItems.includes(item.id) ? '✅' : '⬜️'}</Text>
              <Text style={styles.label}>{item.label}</Text>
              {selectedItems.includes(item.id) && feeValue !== null && (
                <Text style={styles.feeText}>{feeValue.toLocaleString()}{nationality === '태국' ? '฿' : '₫'}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {result && (
        <View style={styles.fixedEstimateContainer}>
          <Text style={styles.estimateLabel}>
            약 {result.totalCost.toLocaleString()}
            {nationality === '태국' ? '฿' : '₫'} 예상
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