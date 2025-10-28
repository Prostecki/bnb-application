"use client";

import { useState } from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DateRange,
} from "react-day-picker";
import { format } from "date-fns";
import PropertyDetailCard from "./PropertyDetailCard";
import type { Property } from "@/models/property.model";

interface BookingSidebarProps {
  property: Property;
  onBookNowClick: () => void;
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
}

const defaultClassNames = getDefaultClassNames();

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
            // showOutsideDays
            modifiers={{
              booked: property.bookedDates.map((d) => new Date(d)),
              disabled: isDateDisabled,
              available: (date: Date) => !isDateDisabled(date),
            }}
            modifiersClassNames={{
              booked: "bg-red-100 text-red-600 line-through",
              available: "bg-green-500 text-white rounded-full",
              disabled: "text-gray-500/80 cursor-not-allowed",
            }}
            classNames={{
              selected: "!bg-blue-900 text-white",
              range_start: "!bg-blue-600 text-white rounded-full",
              outside: "cursor-now-allowed",
              range_middle: "bg-blue-200 text-blue-800 rounded-full",
              range_end: "bg-blue-600 text-white rounded-full",
              root: `${defaultClassNames.root} shadow-lg p-5 rounded-xl`,
              today: "border border-amber-500 rounded-full font-bold",
              chevron: "fill-blue-600",
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
