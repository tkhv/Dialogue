import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_wcHntl5os7pkvUlWBdARva4L6x3BehI",
  authDomain: "project-cs4365.firebaseapp.com",
  projectId: "project-cs4365",
  storageBucket: "project-cs4365.appspot.com",
  messagingSenderId: "32382892349",
  appId: "1:32382892349:web:4c886141d93fbef602ad54",
};

const app = initializeApp(firebaseConfig);
export const imageStorage = getStorage(app);
