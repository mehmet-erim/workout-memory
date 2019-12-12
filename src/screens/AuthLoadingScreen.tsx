import { observer } from 'mobx-react';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Spinner from '../components/Spinner';
import { firebaseInstance } from '../utilities/firebase';
import authStore from '../stores/auth-store';
import loadingStore from '../stores/loading-store';

const error = error => Alert.alert('An error occurred', error);

const AuthLoadingScreen = ({ navigation }) => {
  loadingStore.enabled = true;
  const unsubscribe = firebaseInstance.auth().onAuthStateChanged(user => {
    if (user && user.uid) {
      authStore.currentUserUid = user.uid;
      loadingStore.enabled = false;
      navigation.navigate('Home');
    } else {
      loadingStore.enabled = false;
      navigation.navigate('Login');
    }
    unsubscribe();
  }, error);

  return null;
};

export default AuthLoadingScreen;
