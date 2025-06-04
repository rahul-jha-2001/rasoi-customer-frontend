// File: app/store/[storeUuid]/Providers.tsx
"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { StoreProvider } from "@/lib/context/StoreContext";
import { UserProvider } from "@/lib/context/UserContext";

export default function Providers({ children }: { children: ReactNode }) {
  const { storeUuid } = useParams(); // comes from /store/[storeUuid]/…

  return (
    <StoreProvider value={{ storeUuid: storeUuid ?? null }}>
      <UserProvider>{children}</UserProvider>
    </StoreProvider>
  );
}
