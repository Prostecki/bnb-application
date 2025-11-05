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
          <div className="flex flex-col py-4 gap-4 items-start">
            <p className="text-lg text-gray-500">
              <span className="text-black dark:text-white text-xl font-bold underline underline-offset-2">
                {pricePerNight}$ USD
              </span>{" "}
              per night
            </p>
            <p className="text-lg">
              <span className="font-bold text-xl">Total price:</span>{" "}
              {totalPrice}$ USD for {numberOfNights} nights
            </p>
          </div>
        );
      }
    }
    return <p className="text-lg font-semibold">Add dates for prices</p>;
  };

  return (
    <div className="card bg-base-100">
      <div className="w-full flex flex-col gap-4">
        {renderPrice()}
        <div className="card-actions justify-end">
          {isAuthenticated ? (
            <button
              className="btn w-full btn-primary"
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
