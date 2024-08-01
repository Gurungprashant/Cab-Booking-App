import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKGrQ3ENxIeypJSfdYH00vk1WWNaWUc3o",
  authDomain: "cab-booking-app-d53bf.firebaseapp.com",
  projectId: "cab-booking-app-d53bf",
  storageBucket: "cab-booking-app-d53bf.appspot.com",
  messagingSenderId: "192179462570",
  appId: "1:192179462570:web:f7ccd7c2a7f6adc4bc0bd3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
