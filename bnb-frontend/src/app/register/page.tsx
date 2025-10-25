"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RegisterForm } from "@/components/register/RegisterForm"; // Import the new component

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, register } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  // Handle the submission logic
  const handleSubmit = async ({ name, email, password }: any) => {
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
};

export default RegisterPage;
