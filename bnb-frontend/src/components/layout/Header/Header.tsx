"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "../Logo";

export const Header = () => {
  const { isAuthenticated, logout, loading } = useAuth();

  return (
    <header className="navbar bg-base-100 shadow-lg px-4">
      <div className="navbar-start">
        <Logo />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/home" className="btn btn-ghost text-lg">
              Home
            </Link>
          </li>
          <li>
            <Link href="/properties" className="btn btn-ghost text-lg">
              Properties
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link href="/profile" className="btn btn-ghost">
              Profile
            </Link>
            <button onClick={logout} className="btn btn-primary">
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};