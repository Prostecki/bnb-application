"use client";

import { useState, useEffect } from "react";
import type { Booking } from "@/models/booking.model";
import EditBookingModal from "@/components/bookings/EditBookingModal";
import {
  CalendarIcon,
  CreditCardIcon,
  UsersIcon,
  UserIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { toUpperCaseName } from "@/utils/string";

const iconStyle = "w-6 h-6 mr-3 text-gray-400 dark:text-gray-500";
const labelStyle = "text-xs text-gray-500 dark:text-gray-400";
const baseButton =
  "px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-200";
const editButtonStyle = `${baseButton} bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500`;
const cancelButtonStyle = `${baseButton} bg-red-600 hover:bg-red-700 focus:ring-red-500`;

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
          {bookings.map((booking) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const checkOutDate = new Date(booking.checkOutDate);
            const isPastBooking = checkOutDate < today;

            return (
              <div
                key={booking.id}
                className={`max-w-4xl w-full bg-white dark:bg-black/20 rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 ease-in-out ${
                  isPastBooking
                    ? "opacity-60 grayscale"
                    : "transform hover:scale-[1.01]"
                }`}
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-64 w-full object-cover md:w-64"
                      src={booking.properties?.imageUrl || ""}
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

                    {booking.properties?.additionalImages &&
                      booking.properties.additionalImages.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Additional Images
                          </h3>
                          <div className="flex space-x-2 mt-2">
                            {booking.properties.additionalImages.map(
                              (image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Additional image ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                                />
                              )
                            )}
                          </div>
                        </div>
                      )}

                    <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:space-x-4">
                        <div className="flex items-center">
                          <CalendarIcon className={iconStyle} />
                          <div>
                            <p className={labelStyle}>Check-in</p>
                            <p className="font-semibold">
                              {new Date(
                                booking.checkInDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <CalendarIcon className={iconStyle} />
                          <div>
                            <p className={labelStyle}>Check-out</p>
                            <p className="font-semibold">
                              {new Date(
                                booking.checkOutDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <UserIcon className={iconStyle} />
                            <div>
                              <p className={labelStyle}>Name</p>
                              <p className="font-semibold">
                                {toUpperCaseName(booking.guestFullName)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className={iconStyle} />
                            <div>
                              <p className={labelStyle}>Phone Number</p>
                              <p className="font-semibold">
                                {booking.guestPhoneNumber}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <UsersIcon className={iconStyle} />
                            <div>
                              <p className={labelStyle}>Guests</p>
                              <p className="font-semibold">
                                {booking.numberOfGuests} adult
                                {booking.numberOfGuests > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <CreditCardIcon className={iconStyle} />
                          <div>
                            <p className={labelStyle}>Total Price</p>
                            <p className="font-semibold">
                              ${booking.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      {isPastBooking ? (
                        <p className="text-gray-500 dark:text-gray-400 font-semibold">
                          Your previous booking
                        </p>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingBooking(booking)}
                            className={editButtonStyle}
                          >
                            Edit Booking
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className={cancelButtonStyle}
                          >
                            Cancel Booking
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-8 bg-base-200 rounded-lg">
          <h3 className="text-lg font-semibold">No bookings found</h3>
          <p className="mt-1">You haven\'t made any bookings yet.</p>
        </div>
      )}
    </section>
  );
};

export default MyBookings;
