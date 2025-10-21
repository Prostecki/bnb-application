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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          isOpen={!!editingBooking}
          onClose={() => setEditingBooking(null)}
          onBookingUpdated={handleBookingUpdated}
        />
      )}

      {bookings.length > 0 ? (
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center"
            >
              <img
                src={booking.properties?.imageUrl}
                alt={booking.properties?.name}
                className="w-full sm:w-32 h-32 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900">
                  {booking.properties?.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">From:</span>{" "}
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">To:</span>{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
                <p className="mt-3 font-semibold text-gray-800">
                  Total Price: ${booking.totalPrice}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-stretch sm:self-auto">
                <button
                  onClick={() => setEditingBooking(booking)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm text-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-medium text-sm text-center"
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-16 px-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">
            No bookings found
          </h3>
          <p className="text-gray-500 mt-1">
            You haven't made any bookings yet.
          </p>
        </div>
      )}
    </section>
  );
};

export default MyBookings;
