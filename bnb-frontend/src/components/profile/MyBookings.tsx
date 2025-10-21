"use client";

import { useState, useEffect } from "react";
import type { Booking } from "@/models/booking.model";
import EditBookingModal from "@/components/bookings/EditBookingModal";

interface MyBookingsProps {
  initialBookings: Booking[];
  onDataChange: () => void; // Callback to refetch data in the parent
}

const MyBookings = ({ initialBookings, onDataChange }: MyBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication error. Please log in again.");
          return;
        }
        const res = await fetch(
          `http://localhost:3000/api/bookings/${bookingId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to cancel booking.");
        }
        setBookings((currentBookings) =>
          currentBookings.filter((booking) => booking.id !== bookingId)
        );
        alert("Booking cancelled successfully!");
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleBookingUpdated = () => {
    setEditingBooking(null);
    onDataChange();
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          isOpen={!!editingBooking}
          onClose={() => setEditingBooking(null)}
          onBookingUpdated={handleBookingUpdated}
        />
      )}

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="card lg:card-side bg-base-100 shadow-xl"
            >
              <figure className="w-full lg:w-48 h-48 lg:h-auto flex-shrink-0">
                <img
                  src={booking.properties?.image_url}
                  alt={booking.properties?.name}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{booking.properties?.name}</h3>
                <div className="text-sm">
                  <p>
                    <span className="font-semibold">From:</span>{" "}
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">To:</span>{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-2 font-semibold text-lg">
                  Total Price: ${booking.totalPrice}
                </p>
                <div className="card-actions justify-end">
                  <button
                    onClick={() => setEditingBooking(booking)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="btn btn-error btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-8 bg-base-200 rounded-lg">
          <h3 className="text-lg font-semibold">No bookings found</h3>
          <p className="mt-1">
            You haven't made any bookings yet.
          </p>
        </div>
      )}
    </section>
  );
};

export default MyBookings;
