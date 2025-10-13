"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  pricePerExtraGuest: number;
  imageUrl: string;
}

interface CreatePropertyFormProps {
  onPropertyCreated: () => void;
}

const CreatePropertyForm = ({
  onPropertyCreated,
}: CreatePropertyFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerNight, setPricePerNight] = useState(0);
  const [pricePerExtraGuest, setPricePerExtraGuest] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to create a property.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/properties", {
        method: "POST",
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create property.");
      }

      setSuccess("Property created successfully!");
      // Reset form
      setName("");
      setDescription("");
      setLocation("");
      setPricePerNight(0);
      setPricePerExtraGuest(0);
      setImageUrl("");
      // Notify parent component
      onPropertyCreated();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Create a New Property</h2>
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
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="pricePerNight" className="block text-sm font-medium">
          Price Per Night
        </label>
        <input
          type="number"
          id="pricePerNight"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(Number(e.target.value))}
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Property
      </button>
    </form>
  );
};

export default CreatePropertyForm;
