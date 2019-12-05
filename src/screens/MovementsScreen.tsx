import { FontAwesome } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from '../components/Spinner';
import movementsStore from '../stores/movements-store';

const MovementsScreen = ({ navigation }) => {
  const [text, setText] = useState('');

  if (!movementsStore.movements && !movementsStore.movementList.length) {
    movementsStore.get();
  }

  const save = () => {
    movementsStore.save(text);
  };

  const renderListItem = item => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.item}>{item.val} </Text>
        <TouchableOpacity
          onPress={() => movementsStore.remove(item.key)}
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

  return movementsStore.movementList ? (
    <View style={styles.container}>
      <View style={{ margin: 10, flexDirection: 'row' }}>
        <TextInput
          value={text}
          onChangeText={val => setText(val)}
          style={{
            borderBottomColor: '#f3f3f3',
            borderBottomWidth: 2,
            flexGrow: 0.98,
          }}
          autoCorrect={false}
          placeholder="Add a movement"
        />
        <TouchableOpacity
          onPress={save}
          style={{
            marginLeft: 15,
            borderWidth: 2,
            borderColor: '#333',
            borderRadius: 10,
            padding: 5,
          }}
        >
          <FontAwesome name="check" />
        </TouchableOpacity>
      </View>
      {movementsStore.movementList && movementsStore.movementList.length ? (
        <FlatList
          data={movementsStore.movementList}
          renderItem={({ item }) => renderListItem(item)}
        />
      ) : null}
    </View>
  ) : (
    <Spinner />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default observer(MovementsScreen);
