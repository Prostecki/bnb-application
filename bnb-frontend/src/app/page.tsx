"use client";

import { WelcomeScreen } from "@/components/WelcomeScreen";
import PropertiesPage from "./properties/page"; // Assuming PropertiesPage is the default export
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return <main>{user ? <PropertiesPage /> : <WelcomeScreen />}</main>;
}
