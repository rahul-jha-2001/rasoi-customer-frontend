"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { auth, getRecaptcha, resetRecaptcha } from "@/lib/firebase";
import { signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { toast } from "sonner";

interface OTPModalProps {
  open: boolean;
  onClose: () => void;
}

export default function OTPModal({ open, onClose }: OTPModalProps) {
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef<any>(null);

  // Initialize reCAPTCHA safely
  useEffect(() => {
    if (open && typeof window !== "undefined" && !recaptchaVerifier.current) {
      const timer = setTimeout(() => {
        const container = document.getElementById("recaptcha-container");
        if (container) {
          try {
            recaptchaVerifier.current = getRecaptcha("recaptcha-container");
            recaptchaVerifier.current.render().catch(console.error);
          } catch (err) {
            console.error("Recaptcha creation failed", err);
          }
        }
      }, 300); // delay ensures DOM is rendered

      return () => clearTimeout(timer);
    }
  }, [open]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (!open) {
        resetRecaptcha();
      }
    };
  }, [open]);

  const handleClose = () => {
    setStep("PHONE");
    setName("");
    setPhone("");
    setOtp("");
    setConfirmation(null);
    setLoading(false);
    resetRecaptcha();
    onClose();
  };

  const sendOTP = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter both name and phone number");
      return;
    }

    if (!phone.startsWith("+")) {
      toast.error("Phone number must include country code (e.g., +91XXXXXXXXXX)");
      return;
    }

    setLoading(true);
    try {
      const verifier = recaptchaVerifier.current;
      if (!verifier) throw new Error("reCAPTCHA not initialized");

      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmation(result);
      setStep("OTP");
      toast.success("OTP sent to your phone!");
    } catch (error: any) {
      console.error("Failed to send OTP:", error);

      if (error.code === "auth/invalid-phone-number") {
        toast.error("Invalid phone number format");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Try again later.");
      } else if (error.code === "auth/captcha-check-failed") {
        toast.error("reCAPTCHA failed. Try again.");
        resetRecaptcha();
      } else {
        toast.error("Failed to send OTP. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!confirmation) {
      toast.error("No confirmation result available");
      return;
    }

    setLoading(true);
    try {
      const credential = await confirmation.confirm(otp);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Authentication failed");
      }

      toast.success("Successfully authenticated!");
      handleClose();
      window.location.reload();
    } catch (error: any) {
      console.error("OTP verification failed:", error);

      if (error.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP. Try again.");
      } else if (error.code === "auth/code-expired") {
        toast.error("OTP expired. Request a new one.");
        setStep("PHONE");
        setConfirmation(null);
      } else {
        toast.error("Verification failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep("PHONE");
    setOtp("");
    setConfirmation(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {step === "PHONE" ? "Login with Phone" : "Enter Verification Code"}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {step === "PHONE" ? (
            <>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  placeholder="+91XXXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +91 for India)
                </p>
              </div>

              <Button
                onClick={sendOTP}
                disabled={loading || !name.trim() || !phone.trim()}
                className="w-full"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>

              <div id="recaptcha-container" />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={loading}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">Sent to {phone}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={goBack} disabled={loading} className="flex-1">
                  Back
                </Button>
                <Button onClick={verifyOTP} disabled={loading || otp.length !== 6} className="flex-1">
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
