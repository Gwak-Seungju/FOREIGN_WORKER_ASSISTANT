import React from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';

interface PaginationProps {
  data: any[];
  scrollX: Animated.Value;
}

export default function Pagination({ data, scrollX }: PaginationProps): React.JSX.Element {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        
        return (
          <Animated.View 
            style={[
              styles.dot, 
              { 
                width: dotWidth,
                opacity, 
              }
            ]} 
            key={i.toString()} 
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
});