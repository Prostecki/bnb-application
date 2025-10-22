"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MyProperties from "@/components/profile/MyProperties";
import MyBookings from "@/components/profile/MyBookings";
import UserSettings from "@/components/profile/UserSettings";
import type { Property } from "@/models/property.model";
import type { Booking } from "@/models/booking.model";
import type { BookingSnakeCase } from "@/types/booking.types";

// Helper to map incoming snake_case data to camelCase
const mapBookingToCamelCase = (booking: BookingSnakeCase): Booking => ({
  id: booking.id,
  checkInDate: booking.check_in_date,
  checkOutDate: booking.check_out_date,
  numberOfGuests: booking.number_of_guests,
  totalPrice: booking.total_price,
  guestFullName: booking.guest_full_name,
  guestEmail: booking.guest_email,
  guestPhoneNumber: booking.guest_phone_number,
  properties: booking.properties,
});

const ProfilePage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("properties"); // New state for tabs
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not authenticated.");
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [bookingsRes, propertiesRes] = await Promise.all([
        fetch("http://localhost:3000/api/bookings", { headers }),
        fetch("http://localhost:3000/api/properties/me", { headers }),
      ]);

      if (!bookingsRes.ok) throw new Error("Failed to fetch bookings.");
      if (!propertiesRes.ok) throw new Error("Failed to fetch properties.");

      const bookingsData = await bookingsRes.json();
      const propertiesData = await propertiesRes.json();

      setBookings(bookingsData.map(mapBookingToCamelCase) || []);
      setProperties(propertiesData || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, authLoading]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div role="alert" className="alert alert-error max-w-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-base-100 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Welcome back, {user?.name || user?.email || "User"}
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
              onDataChange={fetchUserData}
            />
          )}
          {activeTab === "bookings" && (
            <MyBookings
              initialBookings={bookings}
              onDataChange={fetchUserData}
            />
          )}
          {activeTab === "settings" && (
            <UserSettings user={user} onDataChange={fetchUserData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
