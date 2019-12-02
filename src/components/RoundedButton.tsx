import React from 'react';
import colors from '../styles/colors';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function({ bgColor = colors.green, onPress }) {
  return (
    <TouchableOpacity style={{ ...styles.button, backgroundColor: bgColor }} onPress={onPress}>
      <AntDesign style={{ color: '#fff', margin: '18%' }} name="plus" size={30} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 100,
    color: colors.white,
  },
});
