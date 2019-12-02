import React, { useState, useEffect } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function({ onChangeModalVisible = val => {}, ...props }) {
  const [modalVisible, setModalVisible] = useState(props.modalVisible);

  useEffect(() => {
    setModalVisible(props.modalVisible);
  }, [props.modalVisible]);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={{ margin: 50 }}>
          <View>
            {props.children}

            <TouchableHighlight
              style={{ position: 'absolute', top: 0, right: 0 }}
              onPress={() => {
                setModalVisible(false);
                onChangeModalVisible(false);
              }}
            >
              <FontAwesome name="times" size={15} />
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
}
