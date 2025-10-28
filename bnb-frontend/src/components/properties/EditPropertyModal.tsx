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
  const [additionalImages, setAdditionalImages] = useState("");

  const [imageUrl, setImageUrl] = useState(property.imageUrl);
  const [availability, setAvailability] = useState<Date[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const additionalImagesArray = additionalImages
    .split("\n")
    .filter((url) => url.trim() !== "");

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
            additionalImages: additionalImagesArray,
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

  return (
    <dialog id="edit_property_modal" className="modal" open={true}>
      <div className="modal-box w-11/12 max-w-3xl">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl mb-6">Edit Property</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="alert alert-error text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div role="alert" className="alert alert-success text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="name">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="description">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered w-full min-h-[100px]"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="location">
                  <span className="label-text">Location</span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="form-control flex-1">
                  <label className="label" htmlFor="pricePerNight">
                    <span className="label-text">Price Per Night</span>
                  </label>
                  <input
                    type="number"
                    id="pricePerNight"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(Number(e.target.value))}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label" htmlFor="pricePerExtraGuest">
                    <span className="label-text">Price Per Extra Guest</span>
                  </label>
                  <input
                    type="number"
                    id="pricePerExtraGuest"
                    value={pricePerExtraGuest}
                    onChange={(e) =>
                      setPricePerExtraGuest(Number(e.target.value))
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label" htmlFor="imageUrl">
                  <span className="label-text">Image URL</span>
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="additionalImages"
                  className="block text-sm font-medium"
                >
                  Additional Images (one URL per line)
                </label>
                <textarea
                  id="additionalImages"
                  value={additionalImages}
                  onChange={(e) => setAdditionalImages(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Edit Availability</span>
              </label>
              <p className="text-xs text-base-content/70 mb-2">
                Select the dates when your property is available for booking.
              </p>
              <div className="border border-base-300 rounded-lg p-2">
                <DayPicker
                  mode="multiple"
                  min={0}
                  selected={availability}
                  onSelect={setAvailability}
                  numberOfMonths={1}
                  disabled={{ before: new Date() }}
                  classNames={{
                    day_selected: "bg-primary text-primary-content",
                    day_today: "font-bold",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-action mt-6">
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditPropertyModal;
