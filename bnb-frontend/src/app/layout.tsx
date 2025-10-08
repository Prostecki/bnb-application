"use client"; // Adding this line at the very beginning of the file

import { Header } from "@/components/layout/Header";
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { WelcomeScreen } from "@/components/WelcomeScreen";

// Remove metadata export
// export const metadata: Metadata = {
//   title: "BNB App",
//   description: "BNB Application",
// };

// Create a separate component for rendering content to use useAuth
const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}
