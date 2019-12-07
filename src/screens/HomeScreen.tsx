import { FontAwesome } from '@expo/vector-icons';
import { Divider, Layout, Text, TopNavigation } from '@ui-kitten/components';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import RoundedButton from '../components/RoundedButton';
import workoutStore from '../stores/workout-store';

const HomeScreen = ({ navigation }) => {
  if (!workoutStore.workouts && !workoutStore.workoutList.length) {
    workoutStore.get();
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title="Workouts" alignment="center" />
      <Divider />
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <RoundedButton
          style={{ position: 'absolute', bottom: '10%', right: '10%' }}
          onPress={() => navigation.navigate('Workout', { test: 'test' })}
          size={40}
        />
        <FlatList
          data={workoutStore.workoutList}
          renderItem={({ item }) => renderListItem(item, navigation)}
        />
      </Layout>
    </SafeAreaView>
  );
};

const renderListItem = (item, navigation) => {
  return (
    <View style={{ flexDirection: 'row', margin: 10 }}>
      <TouchableOpacity
        onPress={() => {
          workoutStore.getOne(item.key).then(() => {
            navigation.navigate('Workout', {
              workoutIndex: item.key,
            });
          });
        }}
      >
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

const styles = StyleSheet.create({
  item: {
    padding: 10,
    paddingLeft: 0,
    fontSize: 18,
    height: 44,
  },
});

export default observer(HomeScreen);
