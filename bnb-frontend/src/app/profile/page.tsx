"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Mock data types - in a real app, these would be imported from a model file
interface Booking {
  id: string;
  properties: {
    name: string;
  };
  check_in_date: string;
  check_out_date: string;
}

interface Property {
  id: string;
  name: string;
  description: string;
}

const ProfilePage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { isAuthenticated, logout, user, loading: authLoading } = useAuth();

  // Check authentication and redirect if not authorized
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router, authLoading]);

  const handleSignOut = () => {
    logout(); // Use function from AuthContext
  };

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch bookings and properties in parallel
        const [bookingsRes, propertiesRes] = await Promise.all([
          fetch("http://localhost:3000/api/bookings", { headers }),
          fetch("http://localhost:3000/api/properties", { headers }),
        ]);

        if (!bookingsRes.ok || !propertiesRes.ok) {
          throw new Error("Failed to fetch data.");
        }

        const bookingsData = await bookingsRes.json();
        const propertiesData = await propertiesRes.json();

        setBookings(bookingsData || []);
        setProperties(propertiesData || []);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="container mx-auto p-4">Loading authentication...</div>
    );
  }

  if (loading) {
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
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
        {bookings.length > 0 ? (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id} className="border p-2 rounded mb-2">
                <p>{booking.properties?.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                  {new Date(booking.check_out_date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You don't have any booking yet!</p>
        )}
      </section>

      {/* <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">My Properties</h2>
        {properties.length > 0 ? (
          <ul>
            {properties.map((property) => (
              <li key={property.id} className="border p-2 rounded mb-2">
                <h3 className="font-bold">{property.title}</h3>
                <p>{property.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Properties not registered</p>
        )}
      </section> */}
    </div>
  );
};

export default ProfilePage;
