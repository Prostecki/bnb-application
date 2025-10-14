"use client";

import { useState, useEffect } from "react";
import type { Property } from "../../models/property.model";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md max-h-full overflow-y-auto text-black">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Edit Property</h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-black rounded text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-black rounded text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-black rounded text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="pricePerNight"
              className="block text-sm font-medium"
            >
              Price Per Night
            </label>
            <input
              type="number"
              id="pricePerNight"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
              className="w-full p-2 border border-black rounded text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="pricePerExtraGuest"
              className="block text-sm font-medium"
            >
              Price Per Extra Guest
            </label>
            <input
              type="number"
              id="pricePerExtraGuest"
              value={pricePerExtraGuest}
              onChange={(e) => setPricePerExtraGuest(Number(e.target.value))}
              className="w-full p-2 border border-black rounded text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium">
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border border-black rounded text-black"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
