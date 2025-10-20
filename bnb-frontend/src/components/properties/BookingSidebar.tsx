"use client";

import { useState, useEffect } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { eachDayOfInterval, parseISO, isSameDay, format } from "date-fns";
import PropertyDetailCard from "./PropertyDetailCard";
import type { Property } from "@/models/property.model";

interface BookingSidebarProps {
  property: Property;
  onBookNowClick: () => void;
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
}

const BookingSidebar = ({
  property,
  onBookNowClick,
  range,
  setRange,
}: BookingSidebarProps) => {
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
    <div className="flex flex-col gap-4">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        className="border rounded-lg p-4 justify-self-center"
        modifiers={{
          booked: bookedDates,
          disabled: isDateDisabled,
          available: (date: Date) => {
            if (isDateDisabled(date)) return false;
            if (range?.from && range.to && date > range.from && date < range.to) {
              return false; // Don't style dates inside the selected range
            }
            return true;
          },
        }}
        modifiersClassNames={{
          available: "available-day",
        }}
        modifiersStyles={{
          booked: {
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            textDecoration: "line-through",
          },
          available: {
            backgroundColor: "#dcfce7",
            color: "#16a34a",
          },
          disabled: {
            backgroundColor: "white",
            color: "#d1d5db",
            cursor: "default",
          },
        }}
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
        onBookNowClick={onBookNowClick}
        range={range}
      />
    </div>
  );
};

export default BookingSidebar;
