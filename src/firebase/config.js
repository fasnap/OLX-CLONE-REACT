import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdlAcZQGlw7YDmC9eS4iMygXJI5UsAsHc",
  authDomain: "olx-clone-7ab6a.firebaseapp.com",
  projectId: "olx-clone-7ab6a",
  storageBucket: "olx-clone-7ab6a.appspot.com",
  messagingSenderId: "946305021427",
  appId: "1:946305021427:web:1aad7ac8de2c8076600e86",
  measurementId: "G-SJYJKDHS70",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestoredb=getFirestore(app)
const storage = getStorage(app); // Initialize storage
export { auth,firestoredb, storage };
