"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { DayPicker, type DateRange } from "react-day-picker";
import { eachDayOfInterval, parseISO, subDays, format } from "date-fns";
import "react-day-picker/dist/style.css";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  pricePerNight: number;
  availability: string[]; // Expect the availability array
}

export default function BookingModal({
  isOpen,
  onClose,
  propertyId,
  availability,
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

  // Effect to process the availability prop
  useEffect(() => {
    if (availability && availability.length > 0) {
      const dates = availability.map((dateStr) => parseISO(dateStr));
      setAvailableDates(dates);
    }
  }, [availability]);

  // Effect to fetch already booked dates
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
      const fetchBookings = async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/properties/${propertyId}/bookings`
          );
          if (!res.ok) throw new Error("Failed to fetch booked dates.");
          const bookings: { check_in_date: string; check_out_date: string }[] =
            await res.json();

          const disabledDates = bookings.flatMap((booking) => {
            const start = parseISO(booking.check_in_date);
            const end = subDays(parseISO(booking.check_out_date), 1);
            if (start > end) return [];
            return eachDayOfInterval({ start, end });
          });
          setBookedDates(disabledDates);
        } catch (err) {
          console.error("Error fetching or processing bookings:", err);
        }
      };
      fetchBookings();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen, propertyId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submission logic remains the same...
  };

  // Combine all disabled conditions
  const disabledDays = [
    { before: new Date() },
    ...bookedDates,
  ];
  if (availableDates.length > 0) {
    disabledDays.push((date) => {
      // Disable date if it's not in the available list
      return !availableDates.some(
        (availableDate) =>
          format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
    });
  }


  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Book Your Stay</h3>
        <form onSubmit={handleBookingSubmit}>
          <div className="form-control items-center py-4">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={disabledDays}
              modifiers={{ available: availableDates }}
              modifiersClassNames={{
                available: 'bg-green-200 text-green-800',
              }}
              numberOfMonths={2}
            />
          </div>
          {/* Rest of the form... */}
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
