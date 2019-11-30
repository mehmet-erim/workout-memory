import React from 'react';
import { EvilIcons } from '@expo/vector-icons';
import colors from '../styles/colors';
import { Animated, Easing } from 'react-native';

const spinValue = new Animated.Value(0);

const spin = () => {
  spinValue.setValue(0);

  Animated.timing(spinValue, {
    toValue: 1,
    duration: 1000,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start(() => spin());
};

spin();
const rotate = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

export default function({ size = 40, color = colors.primary }) {
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <EvilIcons name="spinner-3" size={size} color={color} />
    </Animated.View>
  );
}
