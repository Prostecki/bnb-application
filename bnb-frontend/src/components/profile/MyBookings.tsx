"use client";

import { useState, useEffect } from "react";
import type { Booking } from "@/models/booking.model";
import EditBookingModal from "@/components/bookings/EditBookingModal";
import {
  CalendarIcon,
  CreditCardIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

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
              className="max-w-4xl w-full bg-white dark:bg-black/20 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 ease-in-out"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-64 w-full object-cover md:w-64"
                    src={booking.properties?.image_url || ""}
                    alt={`View of ${booking.properties?.name}`}
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h1 className="block text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        {booking.properties?.name}
                      </h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Booking ID: {booking.id.slice(0, 8)}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <CalendarIcon className="w-6 h-6 mr-3 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Check-in
                        </p>
                        <p className="font-semibold">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="w-6 h-6 mr-3 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Check-out
                        </p>
                        <p className="font-semibold">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="w-6 h-6 mr-3 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Guests
                        </p>
                        <p className="font-semibold">
                          {booking.numberOfGuests} adult
                          {booking.numberOfGuests > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCardIcon className="w-6 h-6 mr-3 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total Price
                        </p>
                        <p className="font-semibold">
                          ${booking.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <button
                      onClick={() => setEditingBooking(booking)}
                      className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition duration-200"
                    >
                      Edit Booking
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-200"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-8 bg-base-200 rounded-lg">
          <h3 className="text-lg font-semibold">No bookings found</h3>
          <p className="mt-1">You haven't made any bookings yet.</p>
        </div>
      )}
    </section>
  );
};

export default MyBookings;
