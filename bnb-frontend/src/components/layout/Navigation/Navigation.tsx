"use client"; // Adding 'use client' since we use hooks

import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

export const Navigation = () => {
  const { isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <nav>
        <div className="flex gap-4">
          <div className="px-3 py-2">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav>
      <ul className="flex gap-4">
        <li>
          <Link href="/home">Home</Link>
        </li>
        <li>
          <Link href="/properties">Properties</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Log out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
