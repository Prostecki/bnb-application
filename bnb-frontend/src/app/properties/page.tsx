"use client";

import { useEffect, useState } from "react";

interface Property {
  id: string;
  title: string;
  description: string;
}

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("http://localhost:3000/api/properties");

        if (!res.ok) {
          throw new Error("Failed to fetch properties.");
        }

        const data = await res.json();
        setProperties(data || []);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>
      {properties.length > 0 ? (
        <ul>
          {properties.map((property) => (
            <li key={property.id} className="border p-4 rounded mb-4">
              <h2 className="text-2xl font-semibold">{property.title}</h2>
              <p>{property.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No properties available at the moment.</p>
      )}
    </div>
  );
};

export default PropertiesPage;
