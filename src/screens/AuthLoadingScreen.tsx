import { observer } from 'mobx-react';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Spinner from '../components/Spinner';
import { firebaseInstance } from '../utilities/firebase';
import authStore from '../stores/auth-store';

const error = error => Alert.alert('An error occurred', error);

const AuthLoadingScreen = ({ navigation }) => {
  const unsubscribe = firebaseInstance.auth().onAuthStateChanged(user => {
    if (user && user.uid) {
      authStore.currentUserUid = user.uid;
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AuthLoadingScreen;
