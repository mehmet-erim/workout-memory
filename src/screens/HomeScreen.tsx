import {
  Divider,
  Icon,
  Layout,
  ListItem,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Swipeout from 'react-native-swipeout';
import { SafeAreaView, ScrollView } from 'react-navigation';
import ListWrapper from '../components/ListWrapper';
import RoundedButton from '../components/RoundedButton';
import loadingStore from '../stores/loading-store';
import workoutStore from '../stores/workout-store';

const CheckIcon = style => <Icon {...style} name="log-out-outline" />;

const HomeScreen = ({ navigation }) => {
  const [swipedKey, setSwipedKey] = useState('');

  if (!workoutStore.workouts && !workoutStore.workoutList.length) {
    loadingStore.enabled = true;
    workoutStore.get().finally(() => (loadingStore.enabled = false));
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
          onPress={() => {
            workoutStore.selectedWorkout = null;
            navigation.navigate('Workout', { workoutIndex: null });
          }}
          size={40}
        />
        <ScrollView style={{ marginBottom: 15 }}>
          <ListWrapper>
            {workoutStore.workoutList.map(workout => (
              <Swipeout
                autoClose={true}
                right={[
                  {
                    text: 'Remove',
                    onPress: () => {
                      workoutStore.remove(swipedKey);
                    },
                    backgroundColor: '#c62828',
                  },
                  {
                    text: 'Duplicate',
                    onPress: () => {
                      {
                        delete workout.key;
                        workoutStore
                          .save({ ...workout, date: new Date() })
                          .then(() => workoutStore.get());
                      }
                    },
                    backgroundColor: '#2196f3',
                  },
                ]}
                onOpen={() => setSwipedKey(workout.key)}
                key={workout.key}
              >
                <ListItem
                  title={workout.title}
                  description={'' + new Date(workout.date)}
                  onPress={() => {
                    loadingStore.enabled = true;
                    workoutStore
                      .getOne(workout.key)
                      .then(() => {
                        navigation.navigate('Workout', {
                          workoutIndex: workout.key,
                        });
                      })
                      .finally(() => (loadingStore.enabled = false));
                  }}
                />
              </Swipeout>
            ))}
          </ListWrapper>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

export default observer(HomeScreen);
