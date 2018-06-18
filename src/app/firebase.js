import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyDR-wc6nYAd7QE9ICLlVSfaaedsgsyLu1w",
    authDomain: "amine-7eb29.firebaseapp.com",
    databaseURL: "https://amine-7eb29.firebaseio.com",
    projectId: "amine-7eb29",
    storageBucket: "amine-7eb29.appspot.com",
    messagingSenderId: "376873008214"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;