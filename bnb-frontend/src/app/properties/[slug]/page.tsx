"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useProperty } from "../../../hooks/useProperty";
import { useAuth } from "../../../context/AuthContext";
import BookingSidebar from "@/components/properties/BookingSidebar";
import { type DateRange } from "react-day-picker";
import PageStatusIndicator from "@/components/common/PageStatusIndicator";
import PropertyHeader from "@/components/properties/PropertyHeader";
import PropertyImageGallery from "@/components/properties/PropertyImageGallery";
import PropertyDetails from "@/components/properties/PropertyDetails";
import HostProfile from "@/components/properties/HostProfile";

// Dynamically import non-critical components
const BookingModal = dynamic(
  () => import("../../../components/properties/BookingModal")
);
const EditPropertyModal = dynamic(
  () => import("@/components/properties/EditPropertyModal")
);
const PropertyRatings = dynamic(
  () => import("@/components/properties/PropertyRatings")
);

export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { property, loading, error } = useProperty(slug);
  const { user, isAuthenticated } = useAuth();

  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();

  const handleBookNowClick = () => {
    setBookingModalOpen(true);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  if (loading || error || !property) {
    return (
      <PageStatusIndicator
        loading={loading}
        error={error}
        notFound={!property && !loading && !error}
        notFoundMessage="Property not found."
      />
    );
  }

  const isOwner = !!(isAuthenticated && user && user.id === property.userId);

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <PropertyHeader
          propertyName={property.name}
          propertyLocation={property.location}
          isOwner={isOwner}
          onEditClick={handleEditClick}
        />

        <PropertyImageGallery property={property} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 bg-base-100 p-8 rounded-2xl shadow-xl">
            {property.user && <HostProfile host={property.user} />}
            <PropertyDetails description={property.description} />
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
