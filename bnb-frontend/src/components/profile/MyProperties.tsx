"use client";

import { useState, useEffect } from "react";
import type { Property } from "@/models/property.model";
import CreatePropertyForm from "@/components/properties/CreatePropertyForm";
import EditPropertyModal from "@/components/properties/EditPropertyModal";

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
        <h2 className="text-2xl font-semibold">My Properties:</h2>
        <button
          onClick={() => setAddProperty((prev) => !prev)}
          className="btn btn-primary btn-sm"
        >
          {addProperty ? "Hide Form" : "+ Add Property"}
        </button>
      </div>

      {addProperty && (
        <div className="my-6">
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

              <div className="mt-2">
                <h4 className="font-semibold">Still Available:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {property.stillAvailableDates?.length > 0 ? (
                    property.stillAvailableDates.map((date) => (
                      <div
                        key={date}
                        className="badge badge-success badge-outline"
                      >
                        {new Date(date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        })}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No remaining availability.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <h4 className="font-semibold">Booked Dates:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {property.bookedDates?.map((date) => (
                    <div
                      key={date}
                      className="badge badge-error badge-outline"
                    >
                      {new Date(date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 font-semibold">
                <p>Price per night: ${property.pricePerNight}</p>
                <p>Price per extra guest: ${property.pricePerExtraGuest}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setEditingProperty(property)}
                  className="btn btn-sm btn-outline btn-info"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="btn btn-sm btn-outline btn-error"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't listed any properties yet.</p>
      )}
    </section>
  );
};

export default MyProperties;
