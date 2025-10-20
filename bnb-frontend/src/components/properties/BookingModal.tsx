"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { DayPicker, type DateRange } from "react-day-picker";
import { eachDayOfInterval, parseISO } from "date-fns";
import "react-day-picker/dist/style.css";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  pricePerNight: number;
  availability?: string[] | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  propertyId,
}: BookingModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { user } = useAuth();
  const [range, setRange] = useState<DateRange | undefined>();
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [guestPhoneNumber, setGuestPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();

      // Fetch property availability data
      const fetchPropertyData = async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/properties/${propertyId}`
          );
          if (!res.ok) throw new Error("Failed to fetch property data.");
          const property = await res.json();

          console.log("Property data:", property);
          console.log("Property availability field:", property.availability);
          console.log(
            "Is availability array?",
            Array.isArray(property.availability)
          );

          if (property.availability && Array.isArray(property.availability)) {
            const availabilityDates = property.availability
              .map((dateStr: string) => {
                console.log("Processing date string:", dateStr, typeof dateStr);
                try {
                  // Try different date parsing methods
                  let date;
                  if (dateStr.includes("T")) {
                    // ISO format with time
                    date = parseISO(dateStr);
                  } else {
                    // Date only format
                    date = new Date(dateStr + "T00:00:00Z");
                  }
                  console.log("Parsed date:", date);
                  return date;
                } catch (err) {
                  console.error("Failed to parse date:", dateStr, err);
                  return null;
                }
              })
              .filter(
                (date: Date | null): date is Date =>
                  date !== null && !isNaN(date.getTime())
              );

            setAvailableDates(availabilityDates);
            console.log("Final available dates:", availabilityDates);
          } else {
            console.log(
              "No availability data or not an array, adding test dates"
            );
            // Add some test dates for demonstration
            const testDates = [
              new Date(2024, 11, 20), // December 20, 2024
              new Date(2024, 11, 21), // December 21, 2024
              new Date(2024, 11, 22), // December 22, 2024
              new Date(2025, 0, 5), // January 5, 2025
              new Date(2025, 0, 6), // January 6, 2025
              new Date(2025, 0, 7), // January 7, 2025
            ];
            setAvailableDates(testDates);
            console.log("Test available dates set:", testDates);
          }
        } catch (err) {
          console.error("Error fetching property data:", err);
        }
      };

      // Fetch existing bookings when modal opens
      const fetchBookings = async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/properties/${propertyId}/bookings`
          );
          if (!res.ok) throw new Error("Failed to fetch booked dates.");
          const bookings: { check_in_date: string; check_out_date: string }[] =
            await res.json();

          const disabled = bookings.flatMap((booking) => {
            const startDate = parseISO(booking.check_in_date);
            const endDate = parseISO(booking.check_out_date);

            // Ensure dates are valid
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              console.error("Invalid dates in booking:", booking);
              return [];
            }

            return eachDayOfInterval({
              start: startDate,
              end: endDate,
            });
          });

          console.log("Fetched bookings:", bookings);
          console.log("Disabled dates count:", disabled.length);
          console.log("Sample disabled dates:", disabled.slice(0, 3));
          setBookedDates(disabled);
        } catch (err) {
          console.error("Error fetching bookings:", err);
        }
      };

      fetchPropertyData();
      fetchBookings();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen, propertyId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to book a property.");
      return;
    }

    if (!range || !range.from || !range.to) {
      setError("Please select a date range.");
      return;
    }

    const bookingData = {
      propertyId,
      checkInDate: range.from.toISOString(),
      checkOutDate: range.to.toISOString(),
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
        onClose();
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
          <div className="form-control items-center py-4">
            {/* Legend */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 text-red-600 rounded text-xs flex items-center justify-center">
                    ×
                  </div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 text-gray-400 rounded text-xs flex items-center justify-center">
                    ×
                  </div>
                  <span>Previous</span>
                </div>
              </div>
            </div>

            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={[
                { before: new Date() },
                ...bookedDates,
                // Disable dates that are not in availability list
                (date: Date) => {
                  if (availableDates.length === 0) return false; // If no availability data, don't disable
                  const isAvailable = availableDates.some(
                    (availableDate) =>
                      date.getTime() === availableDate.getTime()
                  );
                  return !isAvailable && date >= new Date();
                },
              ]}
              modifiers={{
                pastDay: { before: new Date() },
                bookedDay: bookedDates,
                availableDay: availableDates,
                unavailableDay: (date: Date) => {
                  // Day is unavailable if it's not in the availability list and not in the past
                  const isInPast = date < new Date();
                  const isAvailable = availableDates.some(
                    (availableDate) =>
                      date.getTime() === availableDate.getTime()
                  );
                  return !isInPast && !isAvailable && availableDates.length > 0;
                },
              }}
              modifiersClassNames={{
                pastDay: "rdp-day_disabled",
                bookedDay: "rdp-day_disabled",
                availableDay: "rdp-day_available",
                unavailableDay: "rdp-day_unavailable",
              }}
              modifiersStyles={{
                pastDay: {
                  backgroundColor: "#f9fafb",
                  color: "#d1d5db",
                  opacity: 0.6,
                  cursor: "not-allowed",
                  textDecoration: "line-through",
                },
                bookedDay: {
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  opacity: 0.8,
                  cursor: "not-allowed",
                  textDecoration: "line-through",
                  fontWeight: 600,
                },
                availableDay: {
                  backgroundColor: "#dcfce7",
                  color: "#16a34a",
                  fontWeight: 500,
                  border: "1px solid #bbf7d0",
                },
                unavailableDay: {
                  backgroundColor: "#f9fafb",
                  color: "#9ca3af",
                  opacity: 0.7,
                },
              }}
              numberOfMonths={2}
              className="rdp border rounded-lg p-4"
              showOutsideDays
              fixedWeeks
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
