"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import BookingModal from "../../../components/properties/BookingModal";
import PropertyDetailCard from "../../../components/properties/PropertyDetailCard";
import { useProperty } from "../../../hooks/useProperty";

export default function PropertyDetailPage() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { property, loading, error } = useProperty(slug);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">{error}</div>;
  }

  if (!property) {
    return <div className="container mx-auto p-4">Property not found.</div>;
  }

  return (
    <>
      <main>
        <div
          className="hero min-h-[40vh]"
          style={{ backgroundImage: `url(${property.imageUrl})` }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">{property.name}</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p>{property.description}</p>
            </div>
            <div>
              <PropertyDetailCard
                pricePerNight={property.pricePerNight}
                onBookNowClick={() => modalRef.current?.showModal()}
              />
            </div>
          </div>
        </div>
      </main>

      <BookingModal propertyId={property.id} modalRef={modalRef} />
    </>
  );
}