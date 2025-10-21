"use client";

import { useState, useEffect } from "react";
import type { Property } from "../../models/property.model";
import { DayPicker, type DateRange } from "react-day-picker";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import "react-day-picker/dist/style.css";

interface EditPropertyModalProps {
  isOpen: boolean;
  property: Property;
  onClose: () => void;
  onPropertyUpdated?: () => void;
}

const EditPropertyModal = ({
  property,
  onClose,
  onPropertyUpdated,
}: EditPropertyModalProps) => {
  const [name, setName] = useState(property.name);
  const [description, setDescription] = useState(property.description);
  const [location, setLocation] = useState(property.location);
  const [pricePerNight, setPricePerNight] = useState(property.pricePerNight);
  const [pricePerExtraGuest, setPricePerExtraGuest] = useState(
    property.pricePerExtraGuest
  );
  const [imageUrl, setImageUrl] = useState(property.imageUrl);
  const [availability, setAvailability] = useState<Date[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Pre-populate the calendar with existing availability
    if (property.availability) {
      const availableDates = property.availability.map((dateStr) =>
        parseISO(dateStr)
      );
      setAvailability(availableDates);
    }
  }, [property.availability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    // Convert selected dates to an array of yyyy-MM-dd strings
    const availabilityDates = availability.map((date) =>
      format(date, "yyyy-MM-dd")
    );

    try {
      const response = await fetch(
        `http://localhost:3000/api/properties/${property.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            location,
            pricePerNight,
            pricePerExtraGuest,
            imageUrl,
            availability: availabilityDates,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update property.");
      }

      setSuccess("Property updated successfully!");

      setTimeout(() => {
        onPropertyUpdated?.();
        onClose();
      }, 2000); // Show success message for 2 seconds
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputStyles =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Property
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputStyles} min-h-[100px]`}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="pricePerNight"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price Per Night
                  </label>
                  <input
                    type="number"
                    id="pricePerNight"
                    value={pricePerNight}
                    onChange={(e) =>
                      setPricePerNight(Number(e.target.value))
                    }
                    className={inputStyles}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="pricePerExtraGuest"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price Per Extra Guest
                  </label>
                  <input
                    type="number"
                    id="pricePerExtraGuest"
                    value={pricePerExtraGuest}
                    onChange={(e) =>
                      setPricePerExtraGuest(Number(e.target.value))
                    }
                    className={inputStyles}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edit Availability
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Select the dates when your property is available for booking.
              </p>
              <div className="border border-gray-300 rounded-md p-2">
                <DayPicker
                  mode="multiple"
                  min={0}
                  selected={availability}
                  onSelect={setAvailability}
                  numberOfMonths={1}
                  disabled={{ before: new Date() }}
                  classNames={{
                    day_selected: "bg-blue-600 text-white",
                    day_today: "font-bold",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyModal;
