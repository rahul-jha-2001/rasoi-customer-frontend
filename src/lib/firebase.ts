import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

// Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize the Firebase app (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Track active verifiers to prevent duplicates
let activeVerifiers: Map<string, RecaptchaVerifier> = new Map();

/**
 * Creates a new reCAPTCHA verifier instance
 */
export const createRecaptcha = (containerId: string): RecaptchaVerifier | null => {
  if (typeof window === "undefined") return null;
  
  if (!window.grecaptcha) {
    console.warn("⚠️ grecaptcha not yet available");
    return null;
  }

  // Check if auth is properly initialized
  if (!auth || !auth.app) {
    console.error("❌ Firebase Auth not properly initialized");
    return null;
  }

  try {
    // Clear any existing verifier for this container
    clearRecaptcha(containerId);

    console.log("🆕 Creating new reCAPTCHA verifier for:", containerId);
    
    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "normal",
      callback: (response: string) => {
        console.log("✅ reCAPTCHA solved:", response);
      },
      "expired-callback": () => {
        console.warn("⚠️ reCAPTCHA expired");
        clearRecaptcha(containerId);
      },
      "error-callback": (error: any) => {
        console.error("❌ reCAPTCHA error:", error);
        clearRecaptcha(containerId);
      }
    });

    // Store the verifier
    activeVerifiers.set(containerId, recaptchaVerifier);
    
    return recaptchaVerifier;
  } catch (error) {
    console.error("❌ Failed to initialize reCAPTCHA verifier:", error);
    return null;
  }
};

/**
 * Clears a specific reCAPTCHA verifier
 */
export const clearRecaptcha = (containerId: string) => {
  const verifier = activeVerifiers.get(containerId);
  if (verifier) {
    try {
      verifier.clear();
      console.log("🧹 reCAPTCHA verifier cleared for:", containerId);
    } catch (e) {
      console.error("❌ Error clearing verifier:", e);
    } finally {
      activeVerifiers.delete(containerId);
    }
  }
};

/**
 * Clears all active reCAPTCHA verifiers
 */
export const clearAllRecaptcha = () => {
  activeVerifiers.forEach((verifier, containerId) => {
    try {
      verifier.clear();
      console.log("🧹 Cleared reCAPTCHA verifier for:", containerId);
    } catch (e) {
      console.error("❌ Error clearing verifier for", containerId, ":", e);
    }
  });
  activeVerifiers.clear();
};

/**
 * Legacy function for backward compatibility
 */
export const getRecaptcha = createRecaptcha;
export const resetRecaptcha = () => clearAllRecaptcha();