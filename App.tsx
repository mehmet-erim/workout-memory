import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import AuthLoadingScreen from "./src/screens/AuthLoadingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import MovementsScreen from "./src/screens/MovementsScreen";
import TrainingScreen from "./src/screens/TrainingScreen";
import movementsStore from "./src/stores/movements-store";

const AppStack = createStackNavigator(
  { Home: HomeScreen, Training: TrainingScreen, Movements: MovementsScreen },
  { initialRouteName: "Home" }
);
const AuthStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: { headerStyle: { display: "none" } }
  }
});

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default function App() {
  movementsStore.get().then(() => {
    console.log(movementsStore.movementList);
  });

  return <AppContainer />;
}
