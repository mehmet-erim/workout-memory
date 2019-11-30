import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { firebaseInstance } from '../utilities/firebase';
import snq from 'snq';

export default function({ navigation }) {
  return (
    <View style={{ flex: 1, alignContent: 'center' }}>
      <Text style={{ fontSize: 20, textAlign: 'center' }}>
        Welcome {firebaseInstance.auth().currentUser.displayName}!
      </Text>
      <TouchableOpacity onPress={() => firebaseInstance.auth().signOut()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
