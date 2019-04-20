import * as firebase_main from 'firebase';
import 'firebase/firestore';
import { config } from '../env/development';

const firebaseApp = firebase_main.initializeApp(config);
// firebaseApp.firestore().enablePersistence()
export const firestore = firebaseApp.firestore();
export const firebase = firebase_main;
export default firebaseApp;
