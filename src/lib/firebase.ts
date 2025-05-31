import { initializeApp, getApps } from "firebase/app"
import { getAuth, RecaptchaVerifier } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)

let recaptchaVerifier: RecaptchaVerifier | null = null

export const getRecaptcha = (containerId: string): RecaptchaVerifier | null => {
  if (typeof window === "undefined") return null

  // Return existing verifier if it exists and is not destroyed
  if (recaptchaVerifier) {
    try {
      // Check if the verifier is still valid
      return recaptchaVerifier
    } catch (error) {
      // If there's an error, clear and recreate
      recaptchaVerifier = null
    }
  }

  try {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: (response: string) => {
        console.log("✅ reCAPTCHA solved", response)
      },
      "expired-callback": () => {
        console.log("⚠️ reCAPTCHA expired")
        resetRecaptcha()
      },
    })

    return recaptchaVerifier
  } catch (error) {
    console.error("Failed to create reCAPTCHA verifier:", error)
    return null
  }
}

export const resetRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear()
    } catch (error) {
      console.error("Error clearing reCAPTCHA:", error)
    } finally {
      recaptchaVerifier = null
    }
  }
}
