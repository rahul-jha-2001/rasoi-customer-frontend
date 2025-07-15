// src/hooks/useRecaptcha.ts
import { useEffect, useRef } from "react";
import { getRecaptcha, resetRecaptcha } from "@/lib/firebase";

export default function useRecaptcha(open: boolean) {
  const recaptchaVerifier = useRef<any>(null);

  useEffect(() => {
    if (!open || typeof window === "undefined") return;

    const container = document.getElementById("recaptcha-root");
    if (container && !recaptchaVerifier.current) {
      try {
        container.style.visibility = "visible";
        recaptchaVerifier.current = getRecaptcha("recaptcha-root");
        recaptchaVerifier.current.render().catch(console.error);
      } catch (err) {
        console.error("Recaptcha creation failed:", err);
      }
    }
  }, [open]);

  useEffect(() => {
    return () => {
      const container = document.getElementById("recaptcha-root");
      if (container) container.style.visibility = "hidden";
      resetRecaptcha();
    };
  }, [open]);

  return recaptchaVerifier;
}
