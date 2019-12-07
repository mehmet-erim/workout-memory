import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import compare from 'just-compare';
import React, { useEffect, useState } from 'react';
import { DatePickerIOS, Picker, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from '../components/Modal';
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
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-navigation';

const BackIcon = style => <Icon {...style} name="arrow-back" />;
const CheckIcon = style => <Icon {...style} name="checkmark-outline" />;
const CalendarIcon = style => <Icon {...style} name="calendar" />;
const TitleIcon = style => <Icon {...style} name="file-text-outline" />;

const WorkoutScreen = ({ navigation }) => {
  const [isOpenDatepicker, setIsOpenDatepicker] = useState(false);
  const [isOpenMovementList, setIsOpenMovementList] = useState(false);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [setCount, setSetCount] = useState(3);
  const [repCount, setRepCount] = useState(5);
  const [weight, setWeight] = useState(0);
  const [order, setOrder] = useState(0);
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
            ,
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
    const newElements = [...elements, { movement, setCount, repCount, weight, notes, order }];
    setElements([...elements, { movement, setCount, repCount, weight, notes, order }]);
    setTableDatas(newElements);
    setModalVisible(false);

    setMovement(null);
    setSetCount(3);
    setRepCount(5);
    setWeight(0);
    setNotes('');
    setOrder(0);
  };

  const setInitialData = () => {
    const { date, title, elements } = workoutStore.selectedWorkout;
    setElements(elements);
    setTableDatas(elements);
    setDate(new Date(date));
    setTitle(title);
  };

  if (!movementsStore.movements && !movementsStore.movementList.length) {
    movementsStore.get().then(() => setInitialData());
  } else if (workoutStore.selectedWorkout && !title) {
    setInitialData();
  }

  const save = () => {
    workoutStore.save({ date, elements, title, day: new Date() }, workoutIndex).then(() => {
      navigation.navigate('Home');
      workoutStore.selectedWorkout = null;
    });
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  const RightActions = () => <TopNavigationAction icon={CheckIcon} onPress={save} />;

  console.log('rendered');

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

            <Modal modalVisible={modalVisible} onChangeModalVisible={val => setModalVisible(val)}>
              <View>
                <TouchableOpacity onPress={() => setIsOpenMovementList(!isOpenMovementList)}>
                  <Text>
                    {isOpenMovementList ? (
                      <FontAwesome name="times" size={30} />
                    ) : (
                      <MaterialIcons name="fitness-center" size={30} />
                    )}
                    {movementsStore.movements[movement]}
                  </Text>
                </TouchableOpacity>
                {isOpenMovementList ? (
                  <Picker
                    selectedValue={movement}
                    onValueChange={(itemValue, itemIndex) => setMovement(itemValue)}
                  >
                    <Picker.Item label="" value={null} />
                    {movementsStore.movementList.map(data => (
                      <Picker.Item key={data.key} label={data.val} value={data.key} />
                    ))}
                  </Picker>
                ) : null}

                <View style={{ marginTop: 10 }}>
                  <Text>Set:</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Set"
                    value={String(setCount)}
                    onChangeText={text => setSetCount(+text)}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text>Rep:</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Rep"
                    value={String(repCount)}
                    onChangeText={text => setRepCount(+text)}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text>Weight:</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Weight"
                    value={String(weight)}
                    onChangeText={text => setWeight(+text)}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text>Notes:</Text>
                  <TextInput
                    numberOfLines={4}
                    placeholder="Notes"
                    value={notes}
                    onChangeText={text => setNotes(text)}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text>Order:</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Order"
                    value={String(order)}
                    onChangeText={text => setOrder(+text)}
                  />
                </View>
                <Button onPress={addNewElement}>Save</Button>
              </View>
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
});

export default observer(WorkoutScreen);
