"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MyProperties from "@/components/profile/MyProperties";
import MyBookings from "@/components/profile/MyBookings";
import type { Property } from "@/models/property.model";
import type { Booking } from "@/models/booking.model";

// Helper to map incoming snake_case data to camelCase
const mapBookingToCamelCase = (booking: any): Booking => ({
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
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-700 text-2xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-red-600 text-2xl">
        Error: {error}
      </div>
    );
  }

  // Tab button styles
  const tabStyle =
    "whitespace-nowrap py-4 px-4 border-b-2 font-medium text-lg transition-colors duration-200 ease-in-out focus:outline-none";
  const activeTabStyle = "border-blue-600 text-blue-700";
  const inactiveTabStyle =
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen p-8">
      <div className="container mx-auto p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {user?.name || user?.email || "User"}
          </h1>
          <p className="text-lg text-gray-600">
            {user?.isAdmin ? "Administrator" : "User"}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("properties")}
                className={`${tabStyle} ${
                  activeTab === "properties" ? activeTabStyle : inactiveTabStyle
                }`}
              >
                My Properties
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`${tabStyle} ${
                  activeTab === "bookings" ? activeTabStyle : inactiveTabStyle
                }`}
              >
                My Bookings
              </button>
            </nav>
          </div>
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
        </div>
      </div>
    </div>
  );

};

export default ProfilePage;
