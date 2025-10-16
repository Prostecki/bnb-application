"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const WelcomeScreen = () => {
  const router = useRouter();
  const auth = useAuth();

  if (!auth) {
    return null;
  }

  const { user } = auth;

  const handleDiscoverClick = () => {
    if (user) {
      router.push("/properties");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="relative min-h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/Generisanje_Videa_Airbnb_Prizora.mp4"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-white text-center px-4">
        <h1 className="text-5xl font-bold mb-4 [text-shadow:2px_2px_8px_rgba(0,0,0,0.7)]">
          Welcome to YourNextStay
        </h1>
        <p className="text-xl mb-8 max-w-md [text-shadow:2px_2px_8px_rgba(0,0,0,0.7)]">
          Find your next adventure. Book unique homes and experiences around the
          world.
        </p>
        <button
          onClick={handleDiscoverClick}
          className="px-8 py-3 hover:cursor-pointer bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
        >
          Discover
        </button>
      </div>
    </div>
  );
};
