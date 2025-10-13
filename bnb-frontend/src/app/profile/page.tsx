"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CreatePropertyForm from "@/components/properties/CreatePropertyForm";

// Match the backend model
interface Property {
  id: number;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  pricePerExtraGuest: number;
  imageUrl: string;
  userId: string;
}

interface Booking {
  id: string;
  properties: {
    name: string;
    image_url: string;
  };
  check_in_date: string;
  check_out_date: string;
  total_price: number;
}

const ProfilePage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [addProperty, setAddProperty] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, authLoading]);

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

      // Fetch bookings and user's properties in parallel
      const [bookingsRes, propertiesRes] = await Promise.all([
        fetch("http://localhost:3000/api/bookings", { headers }),
        fetch("http://localhost:3000/api/properties/me", { headers }),
      ]);

      if (!bookingsRes.ok) {
        throw new Error("Failed to fetch bookings.");
      }
      if (!propertiesRes.ok) {
        throw new Error("Failed to fetch your properties.");
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
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Properties</h2>
          {properties.length > 0 ? (
            <ul className="space-y-4">
              {properties.map((property) => (
                <li key={property.id} className="border p-4 rounded-lg shadow">
                  <img
                    src={property.imageUrl}
                    alt={property.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-bold">{property.name}</h3>
                  <p className="text-gray-600">{property.location}</p>
                  <p className="mt-2">{property.description}</p>
                  <div className="mt-4 font-semibold">
                    <p>Price per night: ${property.pricePerNight}</p>
                    <p>Price per extra guest: ${property.pricePerExtraGuest}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't listed any properties yet.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
          {bookings.length > 0 ? (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="border p-4 rounded-lg shadow flex items-center"
                >
                  <img
                    src={booking.properties.image_url}
                    alt={booking.properties.name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold">
                      {booking.properties?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </p>
                    <p className="mt-2 font-semibold">
                      Total Price: ${booking.total_price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>You don't have any bookings yet!</p>
          )}
        </section>
      </div>

      <button
        onClick={() => setAddProperty((prev) => !prev)}
        className="border p-2 rounded-md bg-blue-400/80 text-white drop-shadow-md"
      >
        {addProperty ? "Hide form" : "Add property"}
      </button>

      {addProperty && (
        <div className="mt-12">
          <CreatePropertyForm onPropertyCreated={fetchUserData} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
