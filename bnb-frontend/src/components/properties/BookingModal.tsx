"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { type DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

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
      router.push("/profile");
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
      return (
        <p className="text-center text-gray-500">
          Select dates to see a price summary.
        </p>
      );
    }
    const numberOfNights = differenceInDays(range.to, range.from);
    const serviceFee = 25; // Example service fee
    const totalPrice = numberOfNights * pricePerNight + serviceFee;

    return (
      <div className="p-6 my-4 rounded-xl bg-base-200 border border-base-300 shadow-sm">
        <h4 className="text-xl font-bold mb-4">Booking Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Check-in:</span>
            <span className="font-semibold">{format(range.from, "PPP")}</span>
          </div>
          <div className="flex justify-between">
            <span>Check-out:</span>
            <span className="font-semibold">{format(range.to, "PPP")}</span>
          </div>
          <div className="divider my-1"></div>
          <div className="flex justify-between">
            <span>
              ${pricePerNight} x {numberOfNights} nights
            </span>
            <span>${pricePerNight * numberOfNights}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="divider my-1"></div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total Price:</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-11/12 max-w-2xl">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-2xl mb-4">Confirm Your Booking</h3>

        {renderBookingSummary()}

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">Guest Information</h4>
            <div className="space-y-2">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Full Name"
                  value={guestFullName}
                  onChange={(e) => setGuestFullName(e.target.value)}
                  required
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="email"
                  className="grow"
                  placeholder="Email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M11 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2ZM6 3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H6Zm-4 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2Z" />
                </svg>
                <input
                  type="tel"
                  className="grow"
                  placeholder="Phone Number"
                  value={guestPhoneNumber}
                  onChange={(e) => setGuestPhoneNumber(e.target.value)}
                  required
                />
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Number of Guests</span>
                </div>
                <input
                  type="number"
                  min="1"
                  className="input input-bordered w-full"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                  required
                />
              </label>
            </div>
          </div>

          {error && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div role="alert" className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div className="modal-action mt-6">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm & Book
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
