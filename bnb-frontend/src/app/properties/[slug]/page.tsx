"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProperty } from "../../../hooks/useProperty";
import PropertyDetailCard from "../../../components/properties/PropertyDetailCard";
import BookingModal from "../../../components/properties/BookingModal";
import { useAuth } from "../../../context/AuthContext";
import EditPropertyModal from "@/components/properties/EditPropertyModal";
import { DayPicker, type DateRange } from "react-day-picker";
import { eachDayOfInterval, parseISO, isSameDay, format } from "date-fns";
import "react-day-picker/dist/style.css";

export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { property, loading, error } = useProperty(slug);
  const { user, isAuthenticated } = useAuth();

  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    if (property) {
      const fetchBookings = async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/properties/${property.id}/bookings`
          );
          if (!res.ok) throw new Error("Failed to fetch booked dates.");
          const bookings: { check_in_date: string; check_out_date: string }[] =
            await res.json();

          const disabledDates = bookings.flatMap((booking) => {
            const startDate = parseISO(booking.check_in_date);
            const endDate = parseISO(booking.check_out_date);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return [];
            return eachDayOfInterval({ start: startDate, end: endDate });
          });

          setBookedDates(disabledDates);
        } catch (err) {
          console.error("Error fetching bookings:", err);
        }
      };

      fetchBookings();
    }
  }, [property]);

  const toUpperCaseName = (str: string) => {
    return str[0].toUpperCase() + str.slice(1);
  };

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

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;

    if (bookedDates.some((bookedDate) => isSameDay(date, bookedDate))) {
      return true;
    }

    if (property.availability && property.availability.length > 0) {
      const availableDatesSet = new Set(property.availability);
      const dateString = format(date, "yyyy-MM-dd");
      if (!availableDatesSet.has(dateString)) {
        return true;
      }
    }

    return false;
  };

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
              <p className="text-xl font-normal">
                Hosted by{" "}
                <span className="">{toUpperCaseName(property.user.name)}</span>
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={isDateDisabled}
            numberOfMonths={1}
            className="border rounded-lg p-4 justify-self-center"
          />
          {range?.from && (
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setRange(undefined)}
            >
              Clear Dates
            </button>
          )}
          <PropertyDetailCard
            pricePerNight={property.pricePerNight}
            onBookNowClick={handleBookNowClick}
            range={range}
          />
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
    </div>
  );
}
