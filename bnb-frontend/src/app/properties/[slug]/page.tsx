"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProperty } from "../../../hooks/useProperty";
import PropertyDetailCard from "../../../components/properties/PropertyDetailCard";
import BookingModal from "../../../components/properties/BookingModal";
import { useAuth } from "../../../context/AuthContext";
import EditPropertyModal from "@/components/properties/EditPropertyModal";

export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { property, loading, error } = useProperty(slug);
  const { user, isAuthenticated } = useAuth();

  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleBookNowClick = () => {
    setBookingModalOpen(true);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!property) {
    return <div>Property not found.</div>;
  }

  const isOwner = isAuthenticated && user && user.id === property.userId;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
        {isOwner && (
          <button onClick={handleEditClick} className="btn btn-secondary">
            Edit Property
          </button>
        )}
      </div>
      <img
        src={property.imageUrl}
        alt={property.name}
        className="w-full h-96 object-cover rounded-lg mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <p>{property.description}</p>
          {property.user && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Owner</h3>
              <p>{property.user.name}</p>
            </div>
          )}
        </div>
        <div>
          <PropertyDetailCard
            pricePerNight={property.pricePerNight}
            onBookNowClick={handleBookNowClick}
          />
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          propertyId={property.id}
          pricePerNight={property.pricePerNight}
        />
      )}

      {isEditModalOpen && property && (
        <EditPropertyModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          property={property}
        />
      )}
    </div>
  );
}
