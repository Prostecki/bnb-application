import { useState, useEffect, useCallback } from "react";
import { Property } from "@/models/property.model";

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/properties");
      if (!res.ok) {
        throw new Error("Failed to fetch properties.");
      }
      const data = await res.json();
      setProperties(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while fetching properties.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const deleteProperty = async (propertyId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Auhentication error. Please log in again.");

    const res = await fetch(
      `http://localhost:3000/api/properties/${propertyId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete property.");
    }

    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  return { properties, loading, error, deleteProperty };
};
