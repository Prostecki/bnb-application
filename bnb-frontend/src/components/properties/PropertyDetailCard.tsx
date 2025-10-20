"use client";

import { useAuth } from "../../context/AuthContext";
import type { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";

interface PropertyDetailCardProps {
  pricePerNight: number;
  onBookNowClick: () => void;
  range?: DateRange;
}

export default function PropertyDetailCard({
  pricePerNight,
  onBookNowClick,
  range,
}: PropertyDetailCardProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const renderPrice = () => {
    if (range?.from && range?.to) {
      const numberOfNights = differenceInDays(range.to, range.from);
      if (numberOfNights > 0) {
        const totalPrice = numberOfNights * pricePerNight;
        return (
          <>
            <p className="text-lg font-semibold">
              ${totalPrice} total
            </p>
            <p className="text-sm text-gray-500">
              ${pricePerNight} / night for {numberOfNights} nights
            </p>
          </>
        );
      }
    }
    return (
      <p className="text-lg font-semibold">
        Add dates for prices
      </p>
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Booking</h2>
        {renderPrice()}
        <div className="card-actions justify-end">
          {isAuthenticated ? (
            <button
              className="btn btn-primary"
              onClick={onBookNowClick}
              disabled={authLoading || !range?.from}
            >
              {authLoading ? "Loading..." : "Book Now"}
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Please log in to book this property.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
