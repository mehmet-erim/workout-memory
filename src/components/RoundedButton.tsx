import React from 'react';
import colors from '../styles/colors';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function({
  bgColor = colors.green,
  onPress,
  size = 30,
  iconName = 'plus',
  style = {},
}) {
  return (
    <TouchableOpacity
      style={{ ...styles.button, ...style, backgroundColor: bgColor, maxHeight: size, width: size }}
      onPress={onPress}
    >
      <AntDesign style={{ color: '#fff' }} name={iconName} size={size - 15} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    color: colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
