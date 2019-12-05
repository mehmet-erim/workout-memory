import { observable, computed } from 'mobx';
import { database, firebaseInstance } from '../utilities/firebase';
import snq from 'snq';
import authStore from './auth-store';

let index = 0;

class WorkoutsStore {
  @observable workouts;
  @observable selectedWorkout = {};
  @computed get workoutList() {
    if (!this.workouts || !Object.keys(this.workouts).length) {
      return [];
    }

    return Object.keys(this.workouts)
      .map(key => ({
        key,
        val: this.workouts[key],
      }))
      .sort((a, b) => +a.key.replace(/workout/i, '') - +b.key.replace(/workout/i, ''));
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
        this.selectedWorkout = snapshot.val() || {};
      });
  }

  remove(key: string) {
    return database
      .ref(`users/${authStore.currentUserUid}/workouts/${key}`)
      .remove()
      .then(() => this.get());
  }

  save(value: any, key?: string) {
    if (this.workoutList.length) {
      if (!key) {
        key = this.workoutList[this.workoutList.length - 1].key;
      }

      key = String(snq(() => Number(key.replace(/workout/i, '')) + 1, 0));
    } else {
      key = '0';
    }

    return database
      .ref(`users/${authStore.currentUserUid}/workouts/workout${String(key)}`)
      .set({ ...value, date: new Date(value.date).valueOf() })
      .then(() => this.get());
  }
}

const workoutStore = new WorkoutsStore();
export default workoutStore;
