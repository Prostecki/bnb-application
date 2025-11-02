"use client";

import { useState, useEffect } from "react";
import type { Booking } from "@/models/booking.model";

interface EditBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdated: () => void;
}

const EditBookingModal = ({
  booking,
  isOpen,
  onClose,
  onBookingUpdated,
}: EditBookingModalProps) => {
  const [guestFullName, setGuestFullName] = useState(
    booking.guestFullName || ""
  );
  const [guestEmail, setGuestEmail] = useState(booking.guestEmail || "");
  const [guestPhoneNumber, setGuestPhoneNumber] = useState(
    booking.guestPhoneNumber || ""
  );
  const [numberOfGuests, setNumberOfGuests] = useState(
    booking.numberOfGuests || 1
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Reset fields when a new booking is passed in
    setGuestFullName(booking.guestFullName || "");
    setGuestEmail(booking.guestEmail || "");
    setGuestPhoneNumber(booking.guestPhoneNumber || "");
    setNumberOfGuests(booking.numberOfGuests || 1);
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    const updatedFields: Partial<Booking> = {};

    if (guestFullName !== booking.guestFullName) {
      updatedFields.guestFullName = guestFullName;
    }
    if (guestEmail !== booking.guestEmail) {
      updatedFields.guestEmail = guestEmail;
    }
    if (guestPhoneNumber !== booking.guestPhoneNumber) {
      updatedFields.guestPhoneNumber = guestPhoneNumber;
    }
    if (numberOfGuests !== booking.numberOfGuests) {
      updatedFields.numberOfGuests = numberOfGuests;
    }

    if (Object.keys(updatedFields).length === 0) {
      setSuccess("No changes to save.");
      setTimeout(() => {
        onClose();
      }, 1500);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/bookings/${booking.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update booking.");
      }

      setSuccess("Booking updated successfully!");
      setTimeout(() => {
        onBookingUpdated();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md max-h-full overflow-y-auto text-black">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl text-black font-semibold mb-4">
            Edit Booking
          </h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text">Guest Full Name</span>
            </label>
            <input
              type="text"
              className="border p-2 rounded-lg shadow-lg w-full text-black"
              value={guestFullName}
              onChange={(e) => setGuestFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text">Guest Email</span>
            </label>
            <input
              type="email"
              className="border p-2 rounded-lg shadow-lg w-full text-black"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text">Guest Phone Number</span>
            </label>
            <input
              type="tel"
              className="border p-2 rounded-lg w-full shadow-lg text-black"
              value={guestPhoneNumber}
              onChange={(e) => setGuestPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text">Number of Guests</span>
            </label>
            <input
              type="number"
              min="1"
              className="border p-2 rounded-lg shadow-lg w-full text-black"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;
