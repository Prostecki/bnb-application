import { useState, useCallback, useEffect } from "react";
import type { Property } from "@/models/property.model";
import type { Booking } from "@/models/booking.model";
import type { BookingSnakeCase } from "@/types/booking.types";
import type { User } from "@/models/user.model";

// Helper to map incoming snake_case data to camelCase
const mapBookingToCamelCase = (booking: any): Booking => ({
  id: booking.id,
  checkInDate: booking.check_in_date,
  checkOutDate: booking.check_out_date,
  numberOfGuests: booking.number_of_guests,
  totalPrice: booking.total_price,
  guestFullName: booking.guest_full_name,
  guestEmail: booking.guest_email,
  guestPhoneNumber: booking.guest_phone_number,
  properties: booking.properties
    ? {
        id: booking.properties.id,
        name: booking.properties.name,
        description: booking.properties.description,
        location: booking.properties.location,
        imageUrl: booking.properties.image_url,
        pricePerNight: booking.properties.price_per_night,
        pricePerExtraGuest: booking.properties.price_per_extra_guest,
        availability: booking.properties.availability,
        additionalImages: booking.properties.additional_images,
        userId: booking.properties.user_id,
        rating: booking.properties.rating,
        user: booking.properties.user,
        bookings: booking.properties.bookings,
        stillAvailableDates: booking.properties.still_available_dates,
        bookedDates: booking.properties.booked_dates,
      }
    : null,
});

// New: helper to safely obtain a message from unknown errors (no any)
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err) || "An unknown error occurred.";
  } catch {
    return "An unknown error occurred.";
  }
};

export const useProfileData = (user: User | null) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You are not authenticated");
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // pass headers to both requests
      const [bookingsRes, propertiesRes] = await Promise.all([
        fetch("http://localhost:3000/api/bookings", { headers }),
        fetch("http://localhost:3000/api/properties/me", { headers }),
      ]);

      if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
      if (!propertiesRes.ok) throw new Error("Failed to fetch properties");

      const bookingsData = await bookingsRes.json();
      const propertiesData = await propertiesRes.json();

      setBookings(bookingsData.map(mapBookingToCamelCase) || []);
      setProperties(propertiesData || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "An error occured while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { bookings, properties, loading, error, refetch: fetchUserData };
};
