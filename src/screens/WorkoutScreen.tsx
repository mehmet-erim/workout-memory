import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import compare from 'just-compare';
import React, { useEffect, useState, SyntheticEvent } from 'react';
import { DatePickerIOS, Picker, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import RoundedButton from '../components/RoundedButton';
import { database } from '../utilities/firebase';
import { Table, Row, Rows } from 'react-native-table-component';
import snq from 'snq';
import workoutStore from '../stores/workout-store';
import Spinner from '../components/Spinner';
import movementsStore from '../stores/movements-store';
import { observer } from 'mobx-react';
import {
  Icon,
  TopNavigation,
  Divider,
  Layout,
  Text,
  TopNavigationAction,
  Button,
  Datepicker,
  Input,
  Select,
  Modal,
} from '@ui-kitten/components';
import { SafeAreaView, NavigationScreenProp, NavigationRoute } from 'react-navigation';

const BackIcon = style => <Icon {...style} name="arrow-back" />;
const CheckIcon = style => <Icon {...style} name="checkmark-outline" />;
const CalendarIcon = style => <Icon {...style} name="calendar" />;
const TitleIcon = style => <Icon {...style} name="file-text-outline" />;

const WorkoutScreen = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }) => {
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [setCount, setSetCount] = useState(3);
  const [repCount, setRepCount] = useState(5);
  const [weight, setWeight] = useState(0);
  const [notes, setNotes] = useState('');
  const [elements, setElements] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [movement, setMovement] = useState();
  const [tableHead] = useState(['Movement', 'Set', 'Rep', 'Weight', 'Notes']);
  const [tableData, setTableData] = useState([]);

  const workoutIndex = snq(() => navigation.state.params.workoutIndex);

  const setTableDatas = els => {
    setTableData(
      els.reduce(
        (acc, val) => [
          ...acc,
          [
            movementsStore.movements[val.movement],
            val.setCount,
            val.repCount,
            val.weight,
            val.notes,
          ],
        ],
        [],
      ),
    );
  };

  const addNewElement = () => {
    if (!movement) return;

    const newElements = [
      ...elements,
      { movement: movement.key, setCount, repCount, weight, notes },
    ];
    setElements(newElements);
    setTableDatas(newElements);
    setModalVisible(false);

    setMovement(null);
    setSetCount(3);
    setRepCount(5);
    setWeight(0);
    setNotes('');
  };

  const setInitialData = () => {
    const { date, title, elements } = workoutStore.selectedWorkout;
    setElements(elements);
    setTableDatas(elements);
    setDate(new Date(date));
    setTitle(title);
  };

  const clearState = () => {
    setElements([]);
    setTableData([]);
    setDate(new Date());
    setTitle(null);
    setMovement(null);
    setSetCount(3);
    setRepCount(5);
    setWeight(0);
    setNotes('');
    workoutStore.selectedWorkout = null;
  };

  const save = () => {
    if (!title || !date) return;

    workoutStore.save({ date, elements, title, day: new Date() }, workoutIndex).then(() => {
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
    } else if (workoutStore.selectedWorkout && workoutStore.selectedWorkout.title && !title) {
      setInitialData();
    } else if (!workoutStore.selectedWorkout) {
      clearState();
    }
  }, [navigation]);

  const onChangeWeight = text => {
    setWeight(text[text.length - 1] === '.' ? text : +text);
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
          selectedOption={movement}
          onSelect={(selected: { text: string; key: string }) => setMovement(selected)}
        />
        <View style={{ marginTop: 10 }}>
          <Input
            label="Set"
            keyboardType="numeric"
            value={String(setCount)}
            onChangeText={text => setSetCount(+text)}
          />
        </View>
        <Input
          label="Rep"
          keyboardType="numeric"
          placeholder="Rep"
          value={String(repCount)}
          onChangeText={text => setRepCount(+text)}
        />
        <Input
          label="Weight"
          keyboardType="numeric"
          placeholder="Weight"
          value={String(weight)}
          onChangeText={onChangeWeight}
        />
        <Input
          label="Notes"
          placeholder="Notes"
          value={notes}
          onChangeText={text => setNotes(text)}
        />
        <Button style={{ marginTop: 10 }} onPress={addNewElement} disabled={!movement}>
          Save
        </Button>
      </View>
    </Layout>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation alignment="center" leftControl={BackAction()} rightControls={RightActions()} />
      <Divider />
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <RoundedButton
          style={{ position: 'absolute', bottom: '10%', right: '10%', width: 200, height: 200 }}
          onPress={() => setModalVisible(true)}
          size={40}
        />
        {movementsStore.movementList.length && (!workoutIndex || title) ? (
          <View style={styles.container}>
            <View style={styles.workoutContainer}>
              <View>
                <Input
                  placeholder="Title"
                  value={title}
                  onChangeText={text => setTitle(text)}
                  icon={TitleIcon}
                />
                <Datepicker
                  style={{ marginTop: 10 }}
                  placeholder="Pick Date"
                  date={date}
                  onSelect={setDate}
                  icon={CalendarIcon}
                />
              </View>

              <View style={{ marginTop: 15 }}>
                <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                  <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                  <Rows data={tableData} textStyle={styles.text} />
                </Table>
              </View>
            </View>

            <Modal
              allowBackdrop={true}
              backdropStyle={styles.backdrop}
              visible={modalVisible}
              onBackdropPress={() => setModalVisible(false)}
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
