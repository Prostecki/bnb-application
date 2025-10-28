"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MyProperties from "@/components/profile/MyProperties";
import MyBookings from "@/components/profile/MyBookings";
import UserSettings from "@/components/profile/UserSettings";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/profile/LoadingComponent";
import { useProfileData } from "@/hooks/useProfileData";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("properties"); // New state for tabs
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  useAuthRedirect(isAuthenticated, authLoading);

  const capitalizeName = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const { bookings, properties, loading, error, refetch } =
    useProfileData(user);

  if (authLoading || loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div className="bg-base-200 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-base-100 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Welcome back, {capitalizeName(user?.name || user?.email || "User")}
          </h1>
          <div
            className={`badge ${
              user?.isAdmin ? "badge-secondary" : "badge-neutral"
            }`}
          >
            {user?.isAdmin ? "Administrator" : "User"}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div role="tablist" className="tabs tabs-bordered tabs-lg">
          <a
            role="tab"
            className={`tab ${activeTab === "properties" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("properties")}
          >
            My Properties
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "bookings" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "settings" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </a>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "properties" && (
            <MyProperties
              initialProperties={properties}
              onDataChange={refetch}
            />
          )}
          {activeTab === "bookings" && (
            <MyBookings initialBookings={bookings} onDataChange={refetch} />
          )}
          {activeTab === "settings" && (
            <UserSettings user={user} onDataChange={refetch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
