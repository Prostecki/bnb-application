"use client";

import { useState, useEffect } from "react";
import type { Property } from "@/models/property.model";
import CreatePropertyForm from "@/components/properties/CreatePropertyForm";
import EditPropertyModal from "@/components/properties/EditPropertyModal";
import Link from "next/link";

interface MyPropertiesProps {
  initialProperties: Property[];
  onDataChange: () => void; // Callback to refetch data in the parent
}

const MyProperties = ({
  initialProperties,
  onDataChange,
}: MyPropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [addProperty, setAddProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  useEffect(() => {
    setProperties(initialProperties);
  }, [initialProperties]);

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication error. Please log in again.");
          return;
        }
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
        setProperties((currentProperty) =>
          currentProperty.filter((property) => property.id !== propertyId)
        );
        alert("Property deleted successfully!");
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handlePropertyCreated = () => {
    setAddProperty(false);
    onDataChange();
  };

  const handlePropertyUpdated = () => {
    setEditingProperty(null);
    onDataChange();
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Properties</h2>
        <button
          onClick={() => setAddProperty((prev) => !prev)}
          className="btn btn-primary btn-sm"
        >
          {addProperty ? "Cancel" : "+ Add Property"}
        </button>
      </div>

      {addProperty && (
        <div className="my-6 p-6 bg-base-200 rounded-lg">
          <CreatePropertyForm onPropertyCreated={handlePropertyCreated} />
        </div>
      )}

      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          isOpen={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          onPropertyUpdated={handlePropertyUpdated}
        />
      )}

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="card bg-base-100 shadow-xl">
              <figure>
                <Link
                  className="relative w-full"
                  href={`/properties/${property.id}`}
                >
                  <img
                    src={property.imageUrl}
                    alt={property.name}
                    className="w-full h-48 object-cover hover:scale-105 duration-300 hover:opacity-25"
                  />
                </Link>
              </figure>
              <div className="card-body">
                <h3 className="card-title">{property.name}</h3>
                <p>{property.location}</p>
                <p className="text-sm flex-grow">{property.description}</p>

                <div className="space-y-3 text-sm mt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Availability</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.stillAvailableDates?.length > 0 ? (
                        property.stillAvailableDates.map((date) => (
                          <div
                            key={date}
                            className="badge badge-soft badge-success badge-outline"
                          >
                            {new Date(date).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC",
                            })}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs">No remaining availability.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Booked Dates</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.bookedDates?.length > 0 ? (
                        property.bookedDates?.map((date) => (
                          <div
                            key={date}
                            className="badge badge-soft badge-info badge-outline"
                          >
                            {new Date(date).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC",
                            })}
                          </div>
                        ))
                      ) : (
                        <p>Available for booking</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Price per night:</span>
                    <span className="font-semibold">
                      ${property.pricePerNight}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per extra guest:</span>
                    <span className="font-semibold">
                      ${property.pricePerExtraGuest}
                    </span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => setEditingProperty(property)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-8 bg-base-200 rounded-lg">
          <h3 className="text-lg font-semibold">No properties found</h3>
          <p className="mt-1">
            Click the button above to add your first property.
          </p>
        </div>
      )}
    </section>
  );
};

export default MyProperties;
