import React from 'react';
import { Text } from '@ui-kitten/components';
import { View } from 'react-native';

export default function(props = {} as any) {
  return props.children && props.children.length ? (
    props.children
  ) : (
    <View style={{ alignItems: 'center', margin: 10 }}>
      <Text>No data found.</Text>
    </View>
  );
}
