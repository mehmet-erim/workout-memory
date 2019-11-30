import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
