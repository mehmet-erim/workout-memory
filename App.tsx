import { light as lightTheme, mapping } from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import MovementsScreen from './src/screens/MovementsScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import TabBarComponent from './src/components/TabBarComponent';

const TabNavigator = createBottomTabNavigator(
  {
    Movements: MovementsScreen,
    Home: HomeScreen,
    Workout: WorkoutScreen,
  },
  {
    tabBarComponent: TabBarComponent,
    initialRouteName: 'Home',
  },
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
      App: TabNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

export default function App() {
  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <AppContainer />
      </ApplicationProvider>
    </React.Fragment>
  );
}
