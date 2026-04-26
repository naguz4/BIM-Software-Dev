
import { initializeApp } from "firebase/app";
import * as Firestore from "firebase/firestore";
import { IProject } from "../class/Project";


const firebaseConfig = {
  apiKey: "AIzaSyDvOh1BU_mneknRD3MtSdTu17yLYwoc7EQ",
  authDomain: "bim-dev-master-3c250.firebaseapp.com",
  projectId: "bim-dev-master-3c250",
  storageBucket: "bim-dev-master-3c250.firebasestorage.app",
  messagingSenderId: "802311262474",
  appId: "1:802311262474:web:4ccf8576d26f3f4fff6af3"
};


const app = initializeApp(firebaseConfig);
export const firestoreDB = Firestore.getFirestore();

export function getCollection<T>(path: string) {
  return Firestore.collection(firestoreDB, path) as Firestore.CollectionReference<T>
}

export async function deleteDocument (path: string, id: string) {
  const doc = Firestore.doc(firestoreDB, `${path}/${id}`)
  await Firestore.deleteDoc(doc)
}

export async function updateDocument <T extends Record<string, any>>(path: string, id: string, data: T) {
  const doc = Firestore.doc(firestoreDB, `${path}/${id}`)
  await Firestore.updateDoc(doc, data)
}

