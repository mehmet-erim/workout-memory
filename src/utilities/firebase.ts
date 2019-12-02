import * as firebase from 'firebase';
import firebaseConfig from '../constants/firebase-config';
firebase.initializeApp(firebaseConfig);

const firebaseInstance = firebase;
const database = firebaseInstance.database();

export { firebaseInstance, database };
