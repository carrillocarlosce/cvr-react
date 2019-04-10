import firebase from 'firebase';
import { config } from '../env/development';

const firebaseApp = firebase.initializeApp(config);
// firebaseApp.firestore().enablePersistence()
export const firestore = firebaseApp.firestore();
export default firebaseApp;
