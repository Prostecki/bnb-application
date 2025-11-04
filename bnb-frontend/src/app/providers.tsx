"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import React from "react";

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col">
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="flex items-end gap-2">
              <p className="text-2xl">Loading...</p>
              <span className="loading loading-spinner mb-1"></span>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  );
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
