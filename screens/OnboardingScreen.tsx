import { ONBOARDINGDATA } from '@/constants/onboardingData';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  ViewToken,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [isReadyToScroll, setIsReadyToScroll] = useState(false);
  const [guideStep, setGuideStep] = useState<number | null>(null);
  const [showExpandedProgress, setShowExpandedProgress] = useState(false);
  const [highlightLayout, setHighlightLayout] = useState<{x: number; y: number; width: number; height: number} | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();

  const checkButtonRef = useRef<React.ComponentRef<typeof TouchableOpacity>>(null);
  const nextButtonRef = useRef<React.ComponentRef<typeof TouchableOpacity>>(null);
  const progressBarRef = useRef<React.ComponentRef<typeof TouchableOpacity>>(null);

  const pathName = usePathname();
  const isOnboarding = pathName === '/onboarding';

  useEffect(() => {
    const checkFirstUse = async () => {
      const shown = await AsyncStorage.getItem('@onboarding_check_guide_shown');
      if (!shown) {
        setGuideStep(0);
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

  useLayoutEffect(() => {
    // measure after layout stabilized
    let timeout: ReturnType<typeof setTimeout>;
    if (guideStep === 0 && currentIndex === 0 && checkButtonRef.current) {
      timeout = setTimeout(() => {
        checkButtonRef.current?.measureInWindow((x, y, width, height) => {
          setHighlightLayout({ x, y, width, height });
        });
      }, 40);
    } else if (guideStep === 1 && nextButtonRef.current) {
      timeout = setTimeout(() => {
        nextButtonRef.current?.measureInWindow((x, y, width, height) => {
          setHighlightLayout({ x, y, width, height });
        });
      }, 40);
    } else if (guideStep === 2 && progressBarRef.current) {
      timeout = setTimeout(() => {
        progressBarRef.current?.measureInWindow((x, y, width, height) => {
          setHighlightLayout({ x, y, width, height });
        });
      }, 40);
    } else {
      setHighlightLayout(null);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [guideStep, currentIndex]);

  const onGuideNext = async () => {
    if (guideStep === null) return;
    if (guideStep < 2) {
      setGuideStep(guideStep + 1);
    } else {
      // 마지막 단계일 때 저장
      await AsyncStorage.setItem('@onboarding_check_guide_shown', 'true');
      setGuideStep(null);
    }
  };

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
        {guideStep !== null && highlightLayout && (
          <>
            <TouchableWithoutFeedback onPress={() => setGuideStep(null)}>
              <View style={styles.dimOverlay} />
            </TouchableWithoutFeedback>
            <View
              style={[
                styles.highlightBox,
                {
                  top: highlightLayout.y - 8,
                  left: highlightLayout.x - 8,
                  width: highlightLayout.width + 16,
                  height: highlightLayout.height + 16,
                },
              ]}
            />
            <View
              style={[
                styles.guideBubble,
                {
                  position: 'absolute',
                  top:
                    highlightLayout.y + highlightLayout.height > Dimensions.get('window').height * 0.6
                      ? highlightLayout.y - highlightLayout.height- 80 // 위에
                      : highlightLayout.y + highlightLayout.height + 10, // 아래에
                  left: highlightLayout.x + highlightLayout.width / 2 - 125,
                },
              ]}
            >
              {guideStep === 0 && (
                <>
                  <Text style={styles.guideText}>{`'체크' 버튼을 눌러 현재 단계를 완료할 수 있습니다.`}</Text>
                  <TouchableOpacity onPress={onGuideNext} style={styles.guideClose}>
                    <Text style={{ color: '#fff' }}>확인</Text>
                  </TouchableOpacity>
                </>
              )}
              {guideStep === 1 && (
                <>
                  <Text style={styles.guideText}>{`'다음' 버튼을 눌러 다음 단계로 이동하세요.`}</Text>
                  <TouchableOpacity onPress={onGuideNext} style={styles.guideClose}>
                    <Text style={{ color: '#fff' }}>다음</Text>
                  </TouchableOpacity>
                </>
              )}
              {guideStep === 2 && (
                <>
                  <Text style={styles.guideText}>{`프로그레스 바를 눌러 원하는 단계로 바로 이동할 수 있습니다.`}</Text>
                  <TouchableOpacity onPress={onGuideNext} style={styles.guideClose}>
                    <Text style={{ color: '#fff' }}>확인</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
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
              <TouchableOpacity onPress={() => setShowExpandedProgress(!showExpandedProgress)} ref={progressBarRef}>
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
              <TouchableOpacity onPress={toggleCheck} ref={checkButtonRef}>
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
          initialNumToRender={ONBOARDINGDATA.length}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          scrollEnabled={false}
          onLayout={() => setIsReadyToScroll(true)}
        />
        {/* Button group: vertically stack '다음' and (조건부) '홈으로 가기' */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={scrollToNext} ref={nextButtonRef}>
            <Text style={styles.buttonText}>
              {currentIndex === ONBOARDINGDATA.length - 1 ? '시작하기' : '다음'}
            </Text>
          </TouchableOpacity>
          {isOnboarding && (
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.homeButtonText}>홈으로 가기</Text>
            </TouchableOpacity>
          )}
        </View>
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
  highlightBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 8,
    zIndex: 3,
  },
  headerContainer: { paddingTop: 10, paddingHorizontal: 20, zIndex: 2 },
  header: { width: '100%', height: 70, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' },
  leftIcon: { position: 'absolute', left: 0, top: 14, zIndex: 2 },
  rightIcon: { position: 'absolute', right: 0, top: 14, zIndex: 2 },
  progressWrapper: { alignItems: 'center', justifyContent: 'center', marginTop: 4, marginBottom: 0 },
  progressBarBackground: {
    alignItems: 'center',
    backgroundColor: 'inherit',
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
  title: { fontSize: 24, marginBottom: 10, textAlign: 'center' },
  buttonGroup: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
    marginHorizontal: 24,
    marginBottom: 24,
    marginTop: 0,
  },
  button: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
  homeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  homeButtonText: {
    color: '#000',
    fontSize: 16,
  },
  guideBubble: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    maxWidth: 250,
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
    position: 'absolute',
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
