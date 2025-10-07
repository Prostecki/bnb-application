// src/components/WelcomeScreen.tsx
"use client";

import Link from "next/link";

export const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-5xl font-bold mb-4">Welcome to BNB App!</h1>
      <p className="text-xl mb-8">Please, log in or sign up to continue.</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};
