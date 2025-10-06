import { supabase } from "../../lib/supabase.js";
import type { Booking } from "../../models/booking.model.js";

// Helper function to calculate number of nights
const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  if (nights <= 0) {
    throw new Error("Check-out date must be after check-in date.");
  }
  return nights;
};

export const createBooking = async (
  // Pick<T, value> - it's like Omit, but Omit excludes properties, and Pick takes in only those which you need
  bookingData: Pick<Booking, "propertyId" | "checkInDate" | "checkOutDate">,
  userId: string
) => {
  const { propertyId, checkInDate, checkOutDate } = bookingData;

  // 1. Fetch the property to get the price per night
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("pricePerNight")
    .eq("id", propertyId)
    .single();

  if (propertyError || !property) {
    throw new Error(propertyError?.message || "Property not found.");
  }

  // 2. Calculate the total price
  const numberOfNights = calculateNights(
    checkInDate.toString(),
    checkOutDate.toString()
  );
  const totalPrice = numberOfNights * property.pricePerNight;

  // 3. Create the new booking object
  const newBooking = {
    propertyId,
    userId,
    checkInDate,
    checkOutDate,
    totalPrice,
  };

  // 4. Insert the booking into the database
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(*)")
    .eq("userId", userId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getBookingById = async (id: string, userId: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(*)")
    .eq("id", id)
    .eq("userId", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteBooking = async (id: string, userId: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .eq("userId", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: `Booking with id ${id} cancelled successfully.` };
};
