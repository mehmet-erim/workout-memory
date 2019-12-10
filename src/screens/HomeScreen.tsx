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
import { SafeAreaView } from 'react-navigation';
import RoundedButton from '../components/RoundedButton';
import workoutStore from '../stores/workout-store';
import Swipeout from 'react-native-swipeout';
import snq from 'snq';
import ListWrapper from '../components/ListWrapper';

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
        <ListWrapper>
          {workoutStore.workoutList.map(workout => (
            <Swipeout
              right={[
                {
                  text: 'Remove',
                  onPress: () => workoutStore.remove(swipedKey),
                  backgroundColor: '#c62828',
                },
              ]}
              onOpen={() => setSwipedKey(workout.key)}
              key={workout.key}
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
        </ListWrapper>
      </Layout>
    </SafeAreaView>
  );
};

export default observer(HomeScreen);
