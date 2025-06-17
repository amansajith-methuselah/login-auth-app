// Firebase Core & Auth
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCyQq7tjMoF3S716yg5gSPNP6xT730nqnE",
  authDomain: "my-app-2e06d.firebaseapp.com",
  projectId: "my-app-2e06d",
  storageBucket: "my-app-2e06d.appspot.com",
  messagingSenderId: "779067208007",
  appId: "1:779067208007:web:ad05c86277156326f3dc62",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Add user to Firestore (email or phone users)
export const addUserToDB = async (uid, identifier) => {
  try {
    await setDoc(doc(db, "users", uid), {
      identifier, // could be email or phone
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Error saving user to DB:", err);
  }
};

// ✅ Email: Register
export const registerWithEmail = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addUserToDB(user.uid, email);
    return true;
  } catch (error) {
    console.error("Signup failed:", error.message);
    return false;
  }
};

// ✅ Email: Login
export const loginWithEmail = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error("Login failed:", error.message);
    return false;
  }
};

// ✅ Phone: Setup reCAPTCHA
export const setupRecaptcha = (containerId = "recaptcha-container") => {
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(
      containerId,
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved
        },
      },
      auth
    );
  } catch (error) {
    console.error("reCAPTCHA error:", error.message);
  }
};

// ✅ Phone: Send OTP
export const sendPhoneOtp = async (phoneNumber) => {
  try {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return true;
  } catch (error) {
    console.error("OTP send failed:", error.message);
    return false;
  }
};

// ✅ Phone: Confirm OTP
export const confirmOtp = async (otp) => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    const user = result.user;
    await addUserToDB(user.uid, user.phoneNumber);
    return true;
  } catch (error) {
    console.error("OTP verification failed:", error.message);
    return false;
  }
};

// ✅ Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
