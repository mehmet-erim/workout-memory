import { observable, computed } from "mobx";
import { database, firebaseInstance } from "../utilities/firebase";
import snq from "snq";
import authStore from "./auth-store";

let index = 0;

class MovementsStore {
  @observable movements = {};
  @computed get movementList() {
    if (!this.movements || !Object.keys(this.movements).length) {
      return [];
    }

    // console.log(Object.keys(this.movements));
    return Object.keys(this.movements).map(key => ({
      key,
      val: this.movements[key]
    }));
  }

  get() {
    return database
      .ref(`users/${authStore.currentUserUid}/movements`)
      .once("value")
      .then(snapshot => {
        console.log("hey", snapshot.val());
        this.movements = snapshot.val() || {};
      });
  }

  remove(key: string) {
    return database
      .ref(`users/${authStore.currentUserUid}/movements/${key}`)
      .remove()
      .then(() => this.get());
  }

  save(value: string, key?: string) {
    if (this.movementList.length) {
      if (!key) {
        key = this.movementList[this.movementList.length - 1].key;
      }

      key = String(snq(() => Number(key.replace(/movement/i, "")) + 1, 0));
    } else {
      key = "0";
    }

    return database
      .ref(`users/${authStore.currentUserUid}/movements/movement${key}`)
      .set(value)
      .then(() => this.get());
  }
}

const movementsStore = new MovementsStore();
export default movementsStore;
