"use client";

import { useAuth } from "../../context/AuthContext";

interface PropertyDetailCardProps {
  pricePerNight: number;
  onBookNowClick: () => void;
}

export default function PropertyDetailCard({
  pricePerNight,
  onBookNowClick,
}: PropertyDetailCardProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Booking</h2>
        <p className="text-lg font-semibold">Price: ${pricePerNight} / night</p>
        <div className="card-actions justify-end">
          {isAuthenticated ? (
            <button
              className="btn btn-primary"
              onClick={onBookNowClick}
              disabled={authLoading}
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
