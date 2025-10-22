"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProperty } from "../../../hooks/useProperty";
import BookingModal from "../../../components/properties/BookingModal";
import { useAuth } from "../../../context/AuthContext";
import EditPropertyModal from "@/components/properties/EditPropertyModal";
import BookingSidebar from "@/components/properties/BookingSidebar";
import { type DateRange } from "react-day-picker";
import PropertyRatings from "@/components/properties/PropertyRatings";

export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { property, loading, error } = useProperty(slug);
  const { user, isAuthenticated } = useAuth();

  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (property) {
      console.log("Property data:", property);
    }
  }, [property]);

  const toUpperCaseName = (str: string) => {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
  };

  const handleBookNowClick = () => {
    setBookingModalOpen(true);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div role="alert" className="alert alert-error max-w-lg">
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
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div role="alert" className="alert alert-warning max-w-lg">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Property not found.</span>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && user && user.id === property.userId;

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">{property.name}</h1>
          {isOwner && (
            <button onClick={handleEditClick} className="btn btn-secondary">
              Edit Property
            </button>
          )}
        </div>

        {/* Image */}
        <div className="mb-8">
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-[500px] object-cover rounded-2xl shadow-2xl mb-4"
          />
          {property.additionalImages &&
            property.additionalImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {property.additionalImages.map((img, index) => (
                  <img
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    key={index}
                    src={img}
                    alt={`${property.name} additional image ${index + 1}`}
                  />
                ))}
              </div>
            )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 bg-base-100 p-8 rounded-2xl shadow-xl">
            <div className="border-b border-base-300 pb-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">About this property</h2>
              <p className="text-base-content/80 leading-relaxed">
                {property.description}
              </p>
            </div>
            {property.user && (
              <div>
                <h3 className="text-xl font-semibold">
                  Hosted by {toUpperCaseName(property.user.name)}
                </h3>
              </div>
            )}
          </div>

          {/* Right Column: Booking */}
          <div className="lg:col-span-1">
            <BookingSidebar
              property={property}
              onBookNowClick={handleBookNowClick}
              range={range}
              setRange={setRange}
            />
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          propertyId={property.id}
          pricePerNight={property.pricePerNight}
          range={range}
        />
      )}

      {isEditModalOpen && property && (
        <EditPropertyModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          property={property}
        />
      )}
      <PropertyRatings />
    </div>
  );
}
