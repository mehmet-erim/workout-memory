import { observable, computed } from 'mobx';
import { database, firebaseInstance } from '../utilities/firebase';
import snq from 'snq';
import authStore from './auth-store';
import { getNextKey } from '../utilities/common';

let index = 0;

class WorkoutsStore {
  @observable workouts;
  @observable selectedWorkout;
  @computed get workoutList() {
    if (!this.workouts || !Object.keys(this.workouts).length) {
      return [];
    }

    return Object.keys(this.workouts)
      .map(key => ({
        key,
        ...this.workouts[key],
      }))
      .sort((a, b) => a.date - b.date);
  }

  get() {
    return database
      .ref(`users/${authStore.currentUserUid}/workouts`)
      .once('value')
      .then(snapshot => {
        this.workouts = snapshot.val() || {};
      });
  }

  getOne(key: string) {
    return database
      .ref(`users/${authStore.currentUserUid}/workouts/${key}`)
      .once('value')
      .then(snapshot => {
        this.selectedWorkout = { ...(snapshot.val() || {}), key };
      });
  }

  remove(key: string) {
    return database
      .ref(`users/${authStore.currentUserUid}/workouts/${key}`)
      .remove()
      .then(() => this.get());
  }

  save(value: any, key?: string) {
    if (this.workouts && !key) {
      key = getNextKey(this.workouts, 'workout');
    } else if (!key) {
      key = 'workout0';
    }

    return database
      .ref(`users/${authStore.currentUserUid}/workouts/${String(key)}`)
      .set({ ...value, date: new Date(value.date).valueOf() })
      .then(() => this.get());
  }
}

const workoutStore = new WorkoutsStore();
export default workoutStore;
