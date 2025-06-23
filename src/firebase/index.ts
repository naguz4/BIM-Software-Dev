
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDvOh1BU_mneknRD3MtSdTu17yLYwoc7EQ",
  authDomain: "bim-dev-master-3c250.firebaseapp.com",
  projectId: "bim-dev-master-3c250",
  storageBucket: "bim-dev-master-3c250.firebasestorage.app",
  messagingSenderId: "802311262474",
  appId: "1:802311262474:web:4ccf8576d26f3f4fff6af3"
};


const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore();