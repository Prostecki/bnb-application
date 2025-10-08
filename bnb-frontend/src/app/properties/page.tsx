"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  description: string;
  image_url: string;
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
            <Link href={`/properties/${property.id}`} key={property.id}>
              <li className="border p-4 rounded mb-4 cursor-pointer hover:bg-gray-100 transition-colors">
                <h2 className="text-2xl font-semibold">{property.title}</h2>
                <p>{property.description}</p>
                <img
                  src={property.image_url}
                  alt={`Image of ${property.title}`}
                  className="mt-2 rounded"
                />
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No properties available at the moment.</p>
      )}
    </div>
  );
};

export default PropertiesPage;
