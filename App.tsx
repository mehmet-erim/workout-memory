import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import AddEditTrainingScreen from './src/screens/AddEditTrainingScreen';

const AppStack = createStackNavigator(
  { Home: HomeScreen, AddEditTraining: AddEditTrainingScreen },
  { initialRouteName: 'AddEditTraining' },
);
const AuthStack = createStackNavigator({
  Login: { screen: LoginScreen, navigationOptions: { headerStyle: { display: 'none' } } },
});

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'App',
    },
  ),
);

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
