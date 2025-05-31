"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // adjust path as needed
import type { User } from "firebase/auth";


export interface Customer {
  user_uuid: string;      // Firebase UID or your internal UUID
  phone_number: string;
  name: string;
  is_verified: boolean;   // Optional: based on OTP verification
  created_at: string;     // Optional: timestamp
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          user_uuid: firebaseUser.uid,
          phone_number: firebaseUser.phoneNumber || "",
          name: "", // fetch from your DB or ask later
          is_verified: true,
          created_at: new Date().toISOString(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
