"use client";

import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

interface BookingModalProps {
  propertyId: string;
  modalRef: React.RefObject<HTMLDialogElement | null>;
}

export default function BookingModal({
  propertyId,
  modalRef,
}: BookingModalProps) {
  const { user } = useAuth();
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [guestPhoneNumber, setGuestPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to book a property.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    const bookingData = {
      propertyId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      guestFullName: user.name,
      guestEmail: user.email,
      guestPhoneNumber,
    };

    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers,
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create booking.");
      }

      setSuccess("Booking successful!");
      setTimeout(() => {
        modalRef.current?.close();
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Book Your Stay</h3>
        <form onSubmit={handleBookingSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Check-in Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={checkInDate}
              min={today}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Check-out Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={checkOutDate}
              min={checkInDate || today}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Number of Guests</span>
            </label>
            <input
              type="number"
              min="1"
              className="input input-bordered"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              type="tel"
              placeholder="+1234567890"
              className="input input-bordered"
              value={guestPhoneNumber}
              onChange={(e) => setGuestPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Confirm Booking
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => modalRef.current?.close()}
            >
              Cancel
            </button>
          </div>
        </form>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {success && <div className="text-green-500 mt-4">{success}</div>}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
