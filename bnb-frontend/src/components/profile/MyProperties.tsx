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
        <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
        <button
          onClick={() => setAddProperty((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {addProperty ? "Cancel" : "+ Add Property"}
        </button>
      </div>

      {addProperty && (
        <div className="my-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
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
        <ul className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <li
              key={property.id}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col"
            >
              <img
                src={property.imageUrl}
                alt={property.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900">
                  {property.name}
                </h3>
                <p className="text-gray-600 mb-3">{property.location}</p>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  {property.description}
                </p>

                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Availability
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {property.stillAvailableDates?.length > 0 ? (
                        property.stillAvailableDates.map((date) => (
                          <div
                            key={date}
                            className="bg-green-100 text-green-800 font-medium px-2.5 py-1 rounded-full text-xs"
                          >
                            {new Date(date).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC",
                            })}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">
                          No remaining availability.
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Booked Dates
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {property.bookedDates?.map((date) => (
                        <div
                          key={date}
                          className="bg-gray-200 text-gray-600 font-medium px-2.5 py-1 rounded-full text-xs"
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
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="font-medium text-gray-700">
                    Price per night:
                  </span>
                  <span className="font-semibold text-lg text-gray-800">
                    ${property.pricePerNight}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">
                    Price per extra guest:
                  </span>
                  <span className="font-semibold text-lg text-gray-800">
                    ${property.pricePerExtraGuest}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex justify-end space-x-2">
                <button
                  onClick={() => setEditingProperty(property)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-16 px-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">
            No properties found
          </h3>
          <p className="text-gray-500 mt-1">
            Click the button above to add your first property.
          </p>
        </div>
      )}
    </section>
  );
};

export default MyProperties;
