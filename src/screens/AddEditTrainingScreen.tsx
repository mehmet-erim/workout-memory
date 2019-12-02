import React from 'react';
import { View, StyleSheet, TextInput, DatePickerIOS } from 'react-native';

export default function({ navigate }) {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <TextInput style={styles.date} value={'' + new Date()} />
        <TextInput style={styles.date} />
        <TextInput style={styles.date} />
      </View>
      <View style={styles.workoutContainer}>
        <DatePickerIOS date={new Date()} onDateChange={(...args) => console.log(args)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateContainer: {
    flex: 0.5,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    // alignItems: 'center',
  },
  workoutContainer: {
    flex: 3,
  },
  date: {
    borderWidth: 2,
    borderColor: '#333',
    width: '30%',
    height: 50,
  },
});
