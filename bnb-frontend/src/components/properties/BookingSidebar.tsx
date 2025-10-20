"use client";

import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { isSameDay, format } from "date-fns";
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
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    const dateString = format(date, "yyyy-MM-dd");

    // A date is disabled if it's NOT in the list of still available dates.
    return !property.stillAvailableDates.includes(dateString);
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
          booked: property.bookedDates.map((d) => new Date(d)),
          disabled: isDateDisabled,
          available: (date: Date) => !isDateDisabled(date),
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
