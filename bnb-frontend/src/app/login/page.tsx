"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading, error, setError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async () => {
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <LoginForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        setError={setError}
      />
    </div>
  );
}
