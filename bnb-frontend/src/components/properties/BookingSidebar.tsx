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
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center">
        <div className="overflow-x-auto">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={1}
            modifiers={{
              booked: property.bookedDates.map((d) => new Date(d)),
              disabled: isDateDisabled,
              available: (date: Date) => !isDateDisabled(date),
            }}
            modifiersClassNames={{
              booked: "bg-red-100 text-red-600 line-through",
              available: "bg-green-100 text-green-700 font-bold",
              disabled: "text-gray-400",
              selected: "bg-primary text-primary-content",
              today: "font-bold",
            }}
          />
        </div>
        {range?.from && (
          <button
            className="btn btn-sm btn-outline mt-4"
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
    </div>
  );
};

export default BookingSidebar;
