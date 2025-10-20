"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MyProperties from "@/components/profile/MyProperties";
import MyBookings from "@/components/profile/MyBookings";
import type { Property } from "@/models/property.model";
import type { Booking } from "@/models/booking.model";

const ProfilePage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

      setBookings(bookingsData || []);
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
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name || user?.email || "User"}!
        </h1>
        <p className="text-2xl text-gray-600/80 underline italic">
          {user?.isAdmin ? "Admin permissions" : "User permissions"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <MyProperties
          initialProperties={properties}
          onDataChange={fetchUserData}
        />
        <MyBookings initialBookings={bookings} onDataChange={fetchUserData} />
      </div>
    </div>
  );
};

export default ProfilePage;
