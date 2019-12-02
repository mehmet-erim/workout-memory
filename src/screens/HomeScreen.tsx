import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { database, firebaseInstance } from '../utilities/firebase';
import RoundedButton from '../components/RoundedButton';
import colors from '../styles/colors';

export default function({ navigation }) {
  const logout = () => {
    firebaseInstance.auth().signOut();
    navigation.navigate('Login');
  };

  database
    .ref('/')
    .once('value')
    .then(function(snapshot) {
      console.log(snapshot.val());
      // ...
    });

  return (
    <View style={{ flex: 1, alignContent: 'center' }}>
      <Text style={{ fontSize: 20, textAlign: 'center', color: colors.black, fontWeight: '700' }}>
        Workouts
      </Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: '10%', right: '10%' }}>
        <RoundedButton onPress={() => navigation.navigate('AddEditTraining')} />
      </View>
    </View>
  );
}
