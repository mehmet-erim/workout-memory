import React from 'react';
import { View, StyleSheet } from 'react-native';
import Spinner from './Spinner';
import { observer } from 'mobx-react';
import loadingStore from '../stores/loading-store';

const Loading = () => {
  return loadingStore.enabled ? (
    <View style={styles.container}>
      <View style={{ width: 40, height: 40 }}>
        <Spinner />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 99,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default observer(Loading);
