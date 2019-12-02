import { FontAwesome } from '@expo/vector-icons';
import compare from 'just-compare';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { database } from '../utilities/firebase';
import colors from '../styles/colors';

export default function({ navigation }) {
  const [text, setText] = useState('');
  const [movements, setMovements] = useState({});

  let lastMovementKey = '-1';

  useEffect(() => {
    database.ref('/movements').on('value', snapshot => {
      lastMovementKey = Object.keys(snapshot.val() || { '-1': null }).pop();
      if (compare(movements, snapshot.val() || {})) return;
      setMovements(snapshot.val() || {});
    });
  });

  const save = () => {
    const index = Number(lastMovementKey) + 1;
    console.log(text);
    database.ref('/movements/' + index).set(text);
    setText('');
  };

  const remove = key => {
    database.ref('/movements/' + key).remove();
  };

  const renderListItem = item => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.item}>{item.val} </Text>
        <TouchableOpacity
          onPress={() => remove(item.key)}
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
    <View style={styles.container}>
      <View style={{ margin: 10, flexDirection: 'row' }}>
        <TextInput
          value={text}
          onChangeText={val => setText(val)}
          style={{ borderBottomColor: '#f3f3f3', borderBottomWidth: 2, flexGrow: 0.98 }}
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
      {movements && Object.keys(movements) ? (
        <FlatList
          data={Object.keys(movements).map(key => ({ key, val: movements[key] }))}
          renderItem={({ item }) => renderListItem(item)}
        />
      ) : null}
    </View>
  );
}

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
