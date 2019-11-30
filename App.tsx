import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './src/screens/login/LoginScreen';
import HomeScreen from './src/screens/home/HomeScreen';

const AppNavigator = createStackNavigator({
  Home: HomeScreen,
  Login: { screen: LoginScreen, navigationOptions: { headerStyle: { display: 'none' } } },
});

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return <AppContainer />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
