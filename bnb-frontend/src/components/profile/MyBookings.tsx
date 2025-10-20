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
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          isOpen={!!editingBooking}
          onClose={() => setEditingBooking(null)}
          onBookingUpdated={handleBookingUpdated}
        />
      )}

      {bookings.length > 0 ? (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border p-4 rounded-lg shadow flex items-center"
            >
              <img
                src={booking.properties?.image_url}
                alt={booking.properties?.name}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div>
                <h3 className="text-xl font-bold">
                  {booking.properties?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
                <p className="mt-2 font-semibold">
                  Total Price: ${booking.totalPrice}
                </p>
                <p>Guest Full Name: {booking?.guestFullName}</p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setEditingBooking(booking)}
                    className="btn btn-sm btn-info btn-outline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="btn btn-sm btn-error btn-outline"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any bookings yet!</p>
      )}
    </section>
  );
};

export default MyBookings;
