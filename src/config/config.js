import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyCF-A2VtqK0xGovu6OGywLQ-EUprWJ-_Ik",
    authDomain: "logical-fabric.firebaseapp.com",
    databaseURL: "https://logical-fabric.firebaseio.com",
    projectId: "logical-fabric",
    storageBucket: "",
    messagingSenderId: "695552184590",
    appId: "1:695552184590:web:f220b4c04ee5e18b"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();