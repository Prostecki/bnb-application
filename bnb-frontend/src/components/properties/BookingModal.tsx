"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { type DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  pricePerNight: number;
  range?: DateRange;
}

export default function BookingModal({
  isOpen,
  onClose,
  propertyId,
  pricePerNight,
  range,
}: BookingModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { user } = useAuth();
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [guestFullName, setGuestFullName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhoneNumber, setGuestPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
      // Pre-fill guest info with logged-in user's data
      if (user) {
        setGuestFullName(user.name);
        setGuestEmail(user.email);
      }
    } else {
      modalRef.current?.close();
    }
  }, [isOpen, user]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to book a property.");
      return;
    }

    if (!range || !range.from || !range.to) {
      setError("A valid date range is required to book.");
      return;
    }

    const bookingData = {
      propertyId,
      checkInDate: format(range.from, "yyyy-MM-dd"),
      checkOutDate: format(range.to, "yyyy-MM-dd"),
      numberOfGuests,
      guestFullName, // Use state value
      guestEmail, // Use state value
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
        onClose();
        setSuccess("");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while booking the property.");
      }
    }
  };

  const renderBookingSummary = () => {
    if (!range?.from || !range?.to) {
      return <p>No dates selected.</p>;
    }
    const numberOfNights = differenceInDays(range.to, range.from);
    const totalPrice = numberOfNights * pricePerNight;

    return (
      <div className="space-y-2 p-4 border rounded-lg bg-base-200">
        <h4 className="font-semibold">Booking Summary</h4>
        <p>Check-in: {format(range.from, "PPP")}</p>
        <p>Check-out: {format(range.to, "PPP")}</p>
        <p>Total nights: {numberOfNights}</p>
        <p className="text-lg font-bold">Total Price: ${totalPrice}</p>
      </div>
    );
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Your Booking</h3>
        <form onSubmit={handleBookingSubmit}>
          <div className="form-control py-4">{renderBookingSummary()}</div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Guest Full Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={guestFullName}
              onChange={(e) => setGuestFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Guest Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
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
              Confirm & Pay
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {success && <div className="text-green-500 mt-4">{success}</div>}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
