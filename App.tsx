import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import MovementsScreen from './src/screens/MovementsScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import movementsStore from './src/stores/movements-store';

const AppStack = createStackNavigator(
  { Home: HomeScreen, Workout: WorkoutScreen, Movements: MovementsScreen },
  { initialRouteName: 'Home' },
);
const AuthStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: { headerStyle: { display: 'none' } },
  },
});

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

export default function App() {
  return <AppContainer />;
}
