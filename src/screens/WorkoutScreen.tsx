import {
  Button,
  Datepicker,
  Divider,
  Icon,
  Input,
  Layout,
  Modal,
  Select,
  Text,
  TopNavigation,
  TopNavigationAction,
  ListItem,
} from '@ui-kitten/components';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { NavigationRoute, NavigationScreenProp, SafeAreaView } from 'react-navigation';
import snq from 'snq';
import RoundedButton from '../components/RoundedButton';
import Spinner from '../components/Spinner';
import movementsStore from '../stores/movements-store';
import workoutStore from '../stores/workout-store';
import Swipeout from 'react-native-swipeout';

const BackIcon = style => <Icon {...style} name="arrow-back" />;
const CheckIcon = style => <Icon {...style} name="checkmark-outline" />;
const CalendarIcon = style => <Icon {...style} name="calendar" />;
const TitleIcon = style => <Icon {...style} name="file-text-outline" />;

const WorkoutScreen = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }) => {
  const initialState = {
    date: new Date(),
    elements: [],
    modalVisible: false,
    movement: null,
    notes: '',
    repCount: 5,
    selectedElementIndex: null,
    setCount: 3,
    title: '',
    weight: 0,
  };

  const [state, setState] = useState(initialState);

  const patchState = (value: Partial<typeof initialState>) => {
    setState({
      ...state,
      ...value,
    });
  };

  const workoutIndex = snq(() => navigation.state.params.workoutIndex);

  const addNewElement = () => {
    if (!state.movement) return;

    let elements = state.elements;
    if (Number.isInteger(state.selectedElementIndex)) {
      console.log('geldi');
      elements[state.selectedElementIndex] = {
        movement: state.movement.key,
        setCount: state.setCount,
        repCount: state.repCount,
        weight: state.weight,
        notes: state.notes,
      };
    } else {
      elements = [
        ...state.elements,
        {
          movement: state.movement.key,
          setCount: state.setCount,
          repCount: state.repCount,
          weight: state.weight,
          notes: state.notes,
        },
      ];
    }

    patchState({
      elements,
      modalVisible: false,
      movement: null,
      setCount: 3,
      repCount: 5,
      weight: 0,
      notes: '',
    });
  };

  const removeElement = () => {
    patchState({
      elements: [
        ...state.elements.slice(0, state.selectedElementIndex),
        ...state.elements.slice(state.selectedElementIndex + 1),
      ],
      modalVisible: false,
    });
  };

  const setInitialData = () => {
    const { date, title, elements } = workoutStore.selectedWorkout;
    patchState({ elements, date: new Date(date), title });
  };

  const clearState = () => {
    setState(initialState);
    workoutStore.selectedWorkout = null;
  };

  const save = () => {
    if (!state.title || !state.date) return;

    workoutStore
      .save(
        { date: state.date, elements: state.elements, title: state.title, day: new Date() },
        workoutIndex,
      )
      .then(() => {
        navigation.navigate('Home');

        clearState();
      });
  };

  const navigateBack = () => {
    clearState();
    navigation.goBack();
  };

  useEffect(() => {
    if (!movementsStore.movements && !movementsStore.movementList.length) {
      movementsStore.get().then(() => setInitialData());
    } else if (workoutStore.selectedWorkout && workoutStore.selectedWorkout.title && !state.title) {
      setInitialData();
    } else if (!workoutStore.selectedWorkout) {
      clearState();
    }
  }, [navigation]);

  const onChangeWeight = text => {
    patchState({ weight: text[text.length - 1] === '.' ? text : +text });
  };

  // const onBlurWeight = (event: SyntheticEvent) => {
  //   const text = snq(() => (event.nativeEvent as any).text);

  //   if (text) {
  //     setWeight(text[text.length - 1] === '.' ? +text.slice(0, text.lenght - 1) : +text);
  //   }
  // };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  const RightActions = () => <TopNavigationAction icon={CheckIcon} onPress={save} />;

  const renderModalElement = () => (
    <Layout level="3" style={styles.modalContainer}>
      <View style={{ width: '100%' }}>
        <Select
          data={movementsStore.movementList.map(data => ({
            text: data.val,
            key: data.key,
          }))}
          selectedOption={state.movement}
          onSelect={(movement: { text: string; key: string }) => patchState({ movement })}
        />
        <View style={{ marginTop: 10 }}>
          <Input
            label="Set"
            keyboardType="numeric"
            value={String(state.setCount)}
            onChangeText={text => patchState({ setCount: +text })}
          />
        </View>
        <Input
          label="Rep"
          keyboardType="numeric"
          placeholder="Rep"
          value={String(state.repCount)}
          onChangeText={text => patchState({ repCount: +text })}
        />
        <Input
          label="Weight"
          keyboardType="numeric"
          placeholder="Weight"
          value={String(state.weight)}
          onChangeText={onChangeWeight}
        />
        <Input
          label="Notes"
          placeholder="Notes"
          value={state.notes}
          onChangeText={text => patchState({ notes: text })}
        />
        <View>
          <Button style={{ marginTop: 10 }} onPress={addNewElement} disabled={!state.movement}>
            Save
          </Button>
          {state.selectedElementIndex || state.selectedElementIndex === 0 ? (
            <Button
              style={{ marginTop: 10, backgroundColor: '#c62828', borderColor: '#c62828' }}
              onPress={removeElement}
            >
              Remove
            </Button>
          ) : null}
        </View>
      </View>
    </Layout>
  );

  const renderElement = ({ item, index, move, moveEnd, isActive }) => {
    const desc = `Set: ${item.setCount} Rep: ${item.repCount} Weight: ${item.weight} ${
      item.notes ? '\nNotes: ' + item.notes : ''
    }`;
    return (
      <ListItem
        style={{ ...(isActive && { backgroundColor: '#f3f3f3' }) }}
        title={movementsStore.movements[item.movement]}
        description={desc}
        onLongPress={move}
        onPressOut={moveEnd}
        onPress={() =>
          patchState({
            ...item,
            movement: { key: item.movement, text: movementsStore.movements[item.movement] },
            selectedElementIndex: index,
            modalVisible: true,
          })
        }
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation alignment="center" leftControl={BackAction()} rightControls={RightActions()} />
      <Divider />
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <RoundedButton
          style={{ position: 'absolute', bottom: '10%', right: '10%', width: 200, height: 200 }}
          onPress={() =>
            patchState({
              selectedElementIndex: null,
              setCount: 3,
              repCount: 5,
              notes: '',
              weight: 0,
              movement: null,
              modalVisible: true,
            })
          }
          size={40}
        />
        {movementsStore.movementList.length && (!workoutIndex || state.title) ? (
          <View style={styles.container}>
            <View style={styles.workoutContainer}>
              <View>
                <Input
                  placeholder="Title"
                  value={state.title}
                  onChangeText={text => patchState({ title: text })}
                  icon={TitleIcon}
                />
                <Datepicker
                  style={{ marginTop: 10 }}
                  placeholder="Pick Date"
                  date={state.date}
                  onSelect={date => patchState({ date })}
                  icon={CalendarIcon}
                />
              </View>

              <View style={{ marginTop: 15, flex: 10 }}>
                <DraggableFlatList
                  data={state.elements}
                  renderItem={renderElement}
                  keyExtractor={(item, index) => `draggable-item-${item.movement}`}
                  scrollPercent={5}
                  onMoveEnd={({ data }) => patchState({ elements: data })}
                />
              </View>
            </View>

            <Modal
              allowBackdrop={true}
              backdropStyle={styles.backdrop}
              visible={state.modalVisible}
              onBackdropPress={() => patchState({ modalVisible: false })}
            >
              {renderModalElement()}
            </Modal>
          </View>
        ) : (
          <Spinner />
        )}
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '85%',
  },
  workoutContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 350,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default observer(WorkoutScreen);
