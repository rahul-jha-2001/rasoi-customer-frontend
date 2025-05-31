// src/components/Menu/CartSummaryButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CartSummaryButton() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart/count")
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 right-4">
      <Button onClick={() => router.push("/cart")}>
        View Cart ({count})
      </Button>
    </div>
  );
}
