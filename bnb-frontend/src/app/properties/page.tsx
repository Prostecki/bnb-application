"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Property {
  id: string;
  name: string;
  description: string;
  imageUrl: string; // Changed from image_url
  location: string;
  pricePerNight: number;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Link
              href={`/properties/${property.id}`}
              key={property.id}
              className="block card card-compact w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <figure>
                <img
                  src={property.imageUrl} // Changed from image_url
                  alt={property.name}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{property.name}</h2>
                <p className="truncate">{property.description}</p>
                <div className="card-actions justify-end">
                  <span className="btn btn-primary">View</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No properties available at the moment.</p>
      )}
    </div>
  );
};

export default PropertiesPage;
