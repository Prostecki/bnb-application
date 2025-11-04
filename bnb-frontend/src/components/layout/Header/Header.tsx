"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "../Logo";

export const Header = () => {
  const { isAuthenticated, logout, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      router.push(`/properties?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Logo />
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
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter a city or country.."
          className="input input-bordered w-24 md:w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full relative overflow-hidden">
                <Image
                  alt="User Avatar"
                  src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/profile" className="justify-between text-sm">
                  Profile
                </Link>
              </li>
              <li>
                <a className="text-sm" onClick={logout}>
                  Logout
                </a>
              </li>
            </ul>
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
    </div>
  );
};
