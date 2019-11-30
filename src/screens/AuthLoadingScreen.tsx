import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Spinner from '../components/Spinner';
import { firebaseInstance } from '../utilities/firebase';

const error = error => Alert.alert('An error occurred', error);

export default function({ navigation }) {
  const unsubscribe = firebaseInstance.auth().onAuthStateChanged(user => {
    if (user) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Login');
    }
    unsubscribe();
  }, error);

  return (
    <View style={styles.container}>
      <Spinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
