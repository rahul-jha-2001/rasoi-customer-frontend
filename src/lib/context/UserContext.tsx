// File: src/lib/context/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase"; // adjust path as needed


export interface Customer {
  user_uuid: string;      // Firebase UID or your internal UUID
  phone_number: string;
  name: string;
  is_verified: boolean;   // Optional: based on OTP verification
  created_at: string;
  token: string;
}

interface UserContextType {
  user: Customer | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Fetch the ID token (async)
          const token = await firebaseUser.getIdToken();

          setUser({
            user_uuid: firebaseUser.uid,
            phone_number: firebaseUser.phoneNumber || "",
            name: "", // fetch from your DB or ask later
            is_verified: firebaseUser.phoneNumber !== null,
            created_at: new Date().toISOString(),
            token,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
