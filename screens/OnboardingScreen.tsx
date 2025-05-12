import { ONBOARDINGDATA } from '@/constants/onboardingData';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewToken
} from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [isReadyToScroll, setIsReadyToScroll] = useState(false);
  const [showFirstGuide, setShowFirstGuide] = useState(false);
  const [showExpandedProgress, setShowExpandedProgress] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();

  useEffect(() => {
    const checkFirstUse = async () => {
      const shown = await AsyncStorage.getItem('@onboarding_check_guide_shown');
      if (!shown) {
        setShowFirstGuide(true);
        await AsyncStorage.setItem('@onboarding_check_guide_shown', 'true');
      }

      const savedFurthest = await AsyncStorage.getItem('@onboarding_furthest_index');
      if (savedFurthest) {
        const index = parseInt(savedFurthest, 10);
        setFurthestIndex(index);
      }

      const savedChecked = await AsyncStorage.getItem('@onboarding_read_steps');
      if (savedChecked) {
        setCheckedSteps(JSON.parse(savedChecked));
      }
    };
    checkFirstUse();
  }, []);

  const toggleCheck = async () => {
    const key = '@onboarding_read_steps';
    try {
      let updated: number[] = [];
      if (checkedSteps.includes(currentIndex)) {
        updated = checkedSteps.filter((index) => index !== currentIndex);
      } else {
        updated = [...new Set([...checkedSteps, currentIndex])];
        if (currentIndex > furthestIndex) {
          setFurthestIndex(currentIndex);
          await AsyncStorage.setItem('@onboarding_furthest_index', currentIndex.toString());
        }
      }
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      setCheckedSteps(updated);

      if (!checkedSteps.includes(currentIndex)) {
        scrollToNext();
      }
    } catch (err) {
      console.error('Error toggling checked state:', err);
    }
  };

  const scrollToIndex = (index: number) => {
    if (isReadyToScroll) {
      slidesRef.current?.scrollToIndex({ index, animated: true });
      setShowExpandedProgress(false);
    }
  };

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const firstVisibleItem = viewableItems.find((item) => item.index != null);
    if (firstVisibleItem?.index != null) {
      setCurrentIndex(firstVisibleItem.index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('@onboarding_complete', 'true');
    router.replace('/');
  };

  const scrollToNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < ONBOARDINGDATA.length && isReadyToScroll) {
      const offset = width * nextIndex;
      slidesRef.current?.scrollToOffset({ offset, animated: true });
    } else if (nextIndex >= ONBOARDINGDATA.length) {
      completeOnboarding();
    }
  };

  const scrollToPrev = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      slidesRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const isChecked = checkedSteps.includes(currentIndex);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        {showExpandedProgress && (
        <TouchableWithoutFeedback onPress={() => setShowExpandedProgress(false)}>
          <View style={styles.dimOverlay} />
        </TouchableWithoutFeedback>
        )}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.leftIcon}>
              {currentIndex > 0 && (
                <TouchableOpacity onPress={scrollToPrev}>
                  <Entypo name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.progressWrapper}>
              <TouchableOpacity onPress={() => setShowExpandedProgress(!showExpandedProgress)}>
                <View style={showExpandedProgress ? styles.progressBarExpanded : styles.progressBarBackground}>
                  <View style={styles.progressRow}>
                    {ONBOARDINGDATA.map((_, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => scrollToIndex(idx)}
                        disabled={!showExpandedProgress}
                      >
                        <View
                          style={[
                            styles.progressBarItem,
                            idx <= currentIndex && styles.progressBarItemActive,
                            showExpandedProgress && checkedSteps.includes(idx) && styles.progressBarItemChecked,
                          ]}
                        >
                          {showExpandedProgress && checkedSteps.includes(idx) && (
                            <Entypo name="check" size={8} color="green" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.progressText}>
                    {String(currentIndex + 1).padStart(2, '0')} / {String(ONBOARDINGDATA.length).padStart(2, '0')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
                  
            <View style={styles.rightIcon}>
              <TouchableOpacity onPress={toggleCheck}>
                <Entypo name="check" size={20} color={isChecked ? 'green' : 'gray'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
                  
        <FlatList
          data={ONBOARDINGDATA}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}> 
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
            </View>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          initialNumToRender={2}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          scrollEnabled={false}
          onLayout={() => setIsReadyToScroll(true)}
        />
  
        <TouchableOpacity style={styles.button} onPress={scrollToNext}>
          <Text style={styles.buttonText}>
            {currentIndex === ONBOARDINGDATA.length - 1 ? '시작하기' : '다음'}
          </Text>
        </TouchableOpacity>
        
        {showFirstGuide && currentIndex === 0 && (
          <View style={styles.guideOverlay}>
            <View style={styles.guideBubble}>
              <Text style={styles.guideText}>이 버튼을 눌러 체크하고 다음 단계로 넘어가세요</Text>
              <TouchableOpacity onPress={() => setShowFirstGuide(false)} style={styles.guideClose}>
                <Text style={{ color: '#fff' }}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1,
  },
  headerContainer: { paddingTop: 10, paddingHorizontal: 20, zIndex: 2 },
  header: { width: '100%', height: 70, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' },
  leftIcon: { position: 'absolute', left: 0, top: 14, zIndex: 2 },
  rightIcon: { position: 'absolute', right: 0, top: 14, zIndex: 2 },
  progressWrapper: { alignItems: 'center', justifyContent: 'center', marginTop: 4, marginBottom: 0 },
  progressBarBackground: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
  },
  progressBarExpanded: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    transform: [{ scale: 1.3 }],
  },
  progressBarItem: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarItemActive: {
    backgroundColor: 'black',
  },
  progressBarItemChecked: {
    borderColor: 'green',
    borderWidth: 1,
  },
  image: { width: '80%', height: 220, marginBottom: 16 },
  description: { fontSize: 16, color: '#333', textAlign: 'center' },
  slide: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 10 },
  button: { backgroundColor: 'black', padding: 16, margin: 24, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
  guideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  guideBubble: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    maxWidth: 250,
    alignItems: 'center',
  },
  guideText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  guideClose: {
    backgroundColor: 'black',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});
