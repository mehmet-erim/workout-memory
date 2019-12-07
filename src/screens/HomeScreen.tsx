import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, FlatList, StyleSheet } from 'react-native';
import { database, firebaseInstance } from '../utilities/firebase';
import RoundedButton from '../components/RoundedButton';
import colors from '../styles/colors';
import compare from 'just-compare';
import snq from 'snq';
import workoutStore from '../stores/workout-store';
import { observer } from 'mobx-react';
import { FontAwesome } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  if (!workoutStore.workouts && !workoutStore.workoutList.length) {
    workoutStore.get();
  }

  const navigateToWorkout = item => {
    workoutStore.getOne(item.key).then(() => {
      navigation.navigate('Workout', {
        workoutIndex: item.key,
      });
    });
  };

  const renderListItem = item => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigateToWorkout(item)}>
          <Text style={styles.item}>{item.title}</Text>
          <Text>{new Date(item.date).toString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => workoutStore.remove(item.key)}
          style={{
            alignSelf: 'center',
            marginLeft: 15,
            padding: 5,
          }}
        >
          <FontAwesome style={{ color: 'red' }} name="times" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, alignContent: 'center' }}>
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
          color: colors.black,
          fontWeight: '700',
        }}
      >
        Workouts
      </Text>
      {/* <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => navigation.navigate('Movements')}>
        <Text>Movements</Text>
      </TouchableOpacity>
      <RoundedButton
        style={{ position: 'absolute', bottom: '10%', right: '10%' }}
        onPress={() => navigation.navigate('Workout', { test: 'test' })}
        size={40}
      />
      <FlatList data={workoutStore.workoutList} renderItem={({ item }) => renderListItem(item)} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default observer(HomeScreen);
