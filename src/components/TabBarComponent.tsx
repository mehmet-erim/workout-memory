import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';

export default function({ navigation }) {
  const onSelect = index => {
    const selectedTabRoute = navigation.state.routes[index];
    navigation.navigate(selectedTabRoute.routeName);
  };

  return (
    <SafeAreaView>
      <BottomNavigation selectedIndex={navigation.state.index} onSelect={onSelect}>
        <BottomNavigationTab title="MOVEMENTS" />
        <BottomNavigationTab title="WORKOUTS" />
      </BottomNavigation>
    </SafeAreaView>
  );
}
