// Set up firebase database
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAcnzazbe8T3ZN5JFN_mvoermZxeC6Za_s",
  authDomain: "happiness-jar-d0fe4.firebaseapp.com",
  databaseURL: "https://happiness-jar-d0fe4.firebaseio.com",
  projectId: "happiness-jar-d0fe4",
  storageBucket: "happiness-jar-d0fe4.appspot.com",
  messagingSenderId: "376118328153"
};
firebase.initializeApp(config);

export const auth = firebase.auth();
export const database = firebase.database();
export const provider = new firebase.auth.GoogleAuthProvider;
export const dbRef = firebase.database().ref('/');
export default firebase;