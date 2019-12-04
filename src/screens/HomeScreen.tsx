import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet
} from "react-native";
import { database, firebaseInstance } from "../utilities/firebase";
import RoundedButton from "../components/RoundedButton";
import colors from "../styles/colors";
import compare from "just-compare";
import snq from "snq";

let initialized = false;
export default function({ navigation }) {
  const [workouts, setWorkouts] = useState({});

  const logout = () => {
    firebaseInstance.auth().signOut();
    navigation.navigate("Login");
  };

  let obj = {};

  const refresh = () => {
    const ref = database.ref("/workouts");
    ref.once("value").then(function(snapshot) {
      if (compare(obj, snapshot.val())) return;
      setWorkouts(snapshot.val());
      obj = { ...snapshot.val() };
      initialized = true;
      ref.off("value");
    });
  };

  useEffect(() => {
    if (!initialized) {
      refresh();
    }
  });

  const renderListItem = item => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Training", {
              workoutIndex: item.key,
              test: "test"
            })
          }
        >
          <Text style={styles.item}>{item.title}</Text>
          <Text style={styles.item}>{item.date}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => remove(item.key)}
          style={{
            alignSelf: 'center',
            marginLeft: 15,
            padding: 5,
          }}
        >
          <FontAwesome style={{ color: 'red' }} name="times" />
        </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, alignContent: "center" }}>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          color: colors.black,
          fontWeight: "700"
        }}
      >
        Workouts
      </Text>
      <TouchableOpacity
        onPress={() => {
          refresh();
        }}
      >
        <Text>Refresh</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity> */}

      <TouchableOpacity onPress={() => navigation.navigate("Movements")}>
        <Text>Movements</Text>
      </TouchableOpacity>

      <RoundedButton
        style={{ position: "absolute", bottom: "10%", right: "10%" }}
        onPress={() => navigation.navigate("Training", { test: "test" })}
        size={40}
      />

      {workouts && Object.keys(workouts) ? (
        <FlatList
          data={Object.keys(workouts).map(key => ({ ...workouts[key], key }))}
          renderItem={({ item }) => renderListItem(item)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});
