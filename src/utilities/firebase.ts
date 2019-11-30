import * as firebase from 'firebase';
import firebaseConfig from '../constants/firebase-config';
firebase.initializeApp(firebaseConfig);

const firebaseInstance = firebase;

export { firebaseInstance };
