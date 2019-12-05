import { observable, computed } from 'mobx';
import { database, firebaseInstance } from '../utilities/firebase';
import snq from 'snq';
import authStore from './auth-store';
import { getNextKey } from '../utilities/common';

let index = 0;

class MovementsStore {
  @observable movements;
  @computed get movementList() {
    if (!this.movements || !Object.keys(this.movements).length) {
      return [];
    }

    return Object.keys(this.movements)
      .map(key => ({
        key,
        val: this.movements[key],
      }))
      .sort((a, b) => +a.key.replace(/movement/i, '') - +b.key.replace(/movement/i, ''));
  }

  get() {
    return database
      .ref(`users/${authStore.currentUserUid}/movements`)
      .once('value')
      .then(snapshot => {
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
    if (this.movements && !key) {
      key = getNextKey(this.movements, 'movement');
    } else if (!key) {
      key = '0';
    }

    return database
      .ref(`users/${authStore.currentUserUid}/movements/${key}`)
      .set(value)
      .then(() => this.get());
  }
}

const movementsStore = new MovementsStore();
export default movementsStore;
