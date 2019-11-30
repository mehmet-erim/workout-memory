import * as Facebook from 'expo-facebook';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';
import { firebase } from '../../utilities/firebase';

export default function({ navigation }) {
  const loginWithFacebook = async () => {
    let type, token;
    try {
      const res = await Facebook.logInWithReadPermissionsAsync('812845172480383', {
        permissions: ['public_profile'],
      });
      type = res.type;
      token = res.token;
    } catch (error) {
      Alert.alert('An error occurred', error);
    }

    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      firebase
        .auth()
        .signInWithCredential(credential)
        .catch(error => {
          Alert.alert('An error occurred', error);
        })
        .then(() => navigation.navigate('Home'));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={loginWithFacebook}>
        <Text style={{ color: colors.white }}>Login with Facebook</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#4267b2',
    borderColor: '#29487d',
    borderWidth: 1,
    textAlign: 'center',
    padding: 15,
    borderRadius: 100,
  },
});
