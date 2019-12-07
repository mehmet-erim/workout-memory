import { FontAwesome } from '@expo/vector-icons';
import { Divider, Layout, Text, TopNavigation, Input, Icon } from '@ui-kitten/components';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Spinner from '../components/Spinner';
import movementsStore from '../stores/movements-store';

const MovementsScreen = ({ navigation }) => {
  const [text, setText] = useState('');

  if (!movementsStore.movements && !movementsStore.movementList.length) {
    movementsStore.get();
  }

  const save = () => {
    movementsStore.save(text);
    setText('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title="Movements" alignment="center" />
      <Divider />
      <Layout style={{ flex: 1 }}>
        {movementsStore.movementList ? (
          <View>
            <View style={{ margin: 10, flexDirection: 'row' }}>
              <Input
                label="New movement"
                value={text}
                onChangeText={val => setText(val)}
                style={{
                  flexGrow: 0.98,
                }}
                autoCorrect={false}
                returnKeyType="next"
                returnKeyLabel="Save"
                onSubmitEditing={save}
              />
              <TouchableOpacity
                onPress={save}
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name="checkmark-outline"
                  style={{
                    height: 24,
                    marginHorizontal: 8,
                    tintColor: '#8F9BB3',
                    width: 24,
                    marginTop: 10,
                  }}
                />
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
        )}
      </Layout>
    </SafeAreaView>
  );
};

const renderListItem = item => {
  return (
    <View style={{ flexDirection: 'row', margin: 10 }}>
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
