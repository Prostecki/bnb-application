"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProperties } from "@/hooks/useProperties";

const PropertiesPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const { properties, loading, error, deleteProperty } =
    useProperties(searchTerm);
  const { user } = useAuth();

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }
    try {
      await deleteProperty(propertyId);
      alert("Property deleted successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-center">Featured Apartments</h1>
        <p className="text-center">
          Handpicked properties for your perfect getaway
        </p>
      </div>
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="card card-compact w-full bg-base-100 shadow-xl"
            >
              <figure>
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <div className="absolute top-4 right-0 bg-red-500/90 px-2 py-1 text-white rounded-l-md">
                  <span className="font-bold">$ {property.pricePerNight}</span>{" "}
                  / per night
                </div>
                <h2 className="card-title">{property.name}</h2>
                <p className="truncate">{property.description}</p>

                <div className="card-actions justify-between items-center mt-2">
                  <Link
                    href={`/properties/${property.id}`}
                    className="btn btn-primary"
                  >
                    View
                  </Link>
                  {user?.isAdmin && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(property.id);
                      }}
                      className="btn btn-error btn-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>
          {searchTerm
            ? "No properties found matching your search."
            : "No properties available at the moment."}
        </p>
      )}
    </div>
  );
};

export default PropertiesPage;
