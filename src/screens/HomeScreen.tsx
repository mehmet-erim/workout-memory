import { FontAwesome } from '@expo/vector-icons';
import {
  Divider,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Icon,
  ListItem,
} from '@ui-kitten/components';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import RoundedButton from '../components/RoundedButton';
import workoutStore from '../stores/workout-store';
import Swipeout from 'react-native-swipeout';
import snq from 'snq';

const CheckIcon = style => <Icon {...style} name="log-out-outline" />;

const HomeScreen = ({ navigation }) => {
  const [swipedKey, setSwipedKey] = useState('');

  if (!workoutStore.workouts && !workoutStore.workoutList.length) {
    workoutStore.get();
  }
  const RightActions = () => (
    <TopNavigationAction icon={CheckIcon} onPress={() => navigation.navigate('Login')} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title="Workouts" alignment="center" rightControls={RightActions()} />
      <Divider />
      <Layout style={{ flex: 1 }}>
        <RoundedButton
          style={{ position: 'absolute', bottom: '10%', right: '10%', width: 200, height: 200 }}
          onPress={() => navigation.navigate('Workout', { workoutIndex: null })}
          size={40}
        />
        {workoutStore.workoutList.map(workout => (
          <Swipeout
            right={[
              {
                text: 'Remove',
                onPress: () => workoutStore.remove(swipedKey),
                backgroundColor: '#c62828',
              },
            ]}
            key={workout.key}
            onOpen={() => setSwipedKey(workout.key)}
          >
            <ListItem
              title={workout.title}
              description={'' + new Date(workout.date)}
              onPress={() =>
                workoutStore.getOne(workout.key).then(() => {
                  navigation.navigate('Workout', {
                    workoutIndex: workout.key,
                  });
                })
              }
            />
          </Swipeout>
        ))}
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
