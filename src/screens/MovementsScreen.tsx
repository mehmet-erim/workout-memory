import {
  Button,
  Divider,
  Input,
  Layout,
  ListItem,
  Modal,
  TopNavigation,
} from '@ui-kitten/components';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { SafeAreaView } from 'react-navigation';
import RoundedButton from '../components/RoundedButton';
import movementsStore from '../stores/movements-store';
import ListWrapper from '../components/ListWrapper';

const MovementsScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [swipedKey, setSwipedKey] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  if (!movementsStore.movements && !movementsStore.movementList.length) {
    movementsStore.get();
  }

  const save = () => {
    if (!text) return;
    movementsStore.save(text);
    setText('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title="Movements" alignment="center" />
      <Divider />
      <Layout style={{ flex: 1 }}>
        <RoundedButton
          style={{ position: 'absolute', bottom: '10%', right: '10%', width: 200, height: 200 }}
          onPress={() => setModalVisible(true)}
          size={40}
        />
        <ListWrapper>
          {movementsStore.movementList.map(movement => (
            <Swipeout
              right={[
                {
                  text: 'Remove',
                  onPress: () => movementsStore.remove(swipedKey),
                  backgroundColor: '#c62828',
                },
              ]}
              key={movement.key}
              onOpen={() => setSwipedKey(movement.key)}
            >
              <ListItem title={movement.val} />
            </Swipeout>
          ))}
        </ListWrapper>
      </Layout>

      <Modal
        allowBackdrop={true}
        backdropStyle={styles.backdrop}
        visible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <Layout level="3" style={styles.modalContainer}>
          <View style={{ width: '100%' }}>
            <Input
              label="New movement"
              value={text}
              onChangeText={val => setText(val)}
              style={{
                flexGrow: 0.98,
              }}
              autoCorrect={false}
              returnKeyType="done"
              returnKeyLabel="Save"
              onSubmitEditing={save}
            />
            <Button style={{ marginTop: 10 }} onPress={save}>
              Save
            </Button>
          </View>
        </Layout>
      </Modal>
    </SafeAreaView>
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 350,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default observer(MovementsScreen);
