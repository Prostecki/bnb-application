import { supabase } from "../../lib/supabase.js";
import type { Booking } from "../../models/booking.model.js";
import { eachDayOfInterval, format } from "date-fns";

export const createBooking = async (
  bookingData: Pick<
    Booking,
    | "propertyId"
    | "checkInDate"
    | "checkOutDate"
    | "numberOfGuests"
    | "guestEmail"
    | "guestFullName"
    | "guestPhoneNumber"
  >,
  userId: string // userId is now mandatory
) => {
  const {
    propertyId,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    guestEmail,
    guestFullName,
    guestPhoneNumber,
  } = bookingData;

  // Basic validation
  if (!checkInDate || !checkOutDate) {
    throw new Error("Check-in date and check-out date are required.");
  }
  if (numberOfGuests <= 0) {
    throw new Error("Number of guests must be at least 1.");
  }

  // 1. Check against the property's general availability list
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("availability")
    .eq("id", propertyId)
    .single();

  if (propertyError || !property) {
    throw new Error("Property not found or could not be fetched.");
  }

  const availableDates = new Set(property.availability || []);
  const requestedDates = eachDayOfInterval({
    start: new Date(checkInDate),
    end: new Date(checkOutDate),
  });

  for (const date of requestedDates) {
    const dateString = format(date, "yyyy-MM-dd");
    if (!availableDates.has(dateString)) {
      throw new Error(
        `Date ${dateString} is not available for booking for this property.`
      );
    }
  }

  // 2. Check for conflicting bookings (existing availability check)
  const { data: conflictingBookings, error: availabilityError } = await supabase
    .from("bookings")
    .select("id")
    .eq("property_id", propertyId)
    .lt("check_in_date", checkOutDate) // An existing booking starts before the new one ends
    .gt("check_out_date", checkInDate); // And an existing booking ends after the new one starts

  if (availabilityError) {
    throw new Error(
      `Error checking availability: ${availabilityError.message}`
    );
  }

  if (conflictingBookings && conflictingBookings.length > 0) {
    throw new Error("These dates are already booked for this property.");
  }

  // The logic for price calculation has been removed.
  // The database trigger `calculate_booking_total_price` will handle it automatically.
  const newBooking = {
    property_id: propertyId,
    user_id: userId,
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
    number_of_guests: numberOfGuests,
    guest_email: guestEmail,
    guest_full_name: guestFullName,
    guest_phone_number: guestPhoneNumber,
    // total_price is no longer sent; the trigger will compute it.
  };

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
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getBookingsByPropertyId = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("check_in_date, check_out_date")
    .eq("property_id", propertyId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getBookingById = async (id: string | number, userId: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(*)")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteBooking = async (
  id: string | number,
  userId: string | null
) => {
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("check_in_date, user_id")
    .eq("id", id)
    .single();

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (fetchError) {
    console.error("Supabase fetch error:", fetchError);
    throw new Error("Could not fetch booking details.");
  }

  if (userId && booking.user_id !== userId) {
    throw new Error("You are not authorized to delete this booking.");
  }

  const checkInDate = new Date(booking.check_in_date);
  const now = new Date();
  const timeDifference = checkInDate.getTime() - now.getTime();
  const hoursDifference = timeDifference / (1000 * 3600);

  if (hoursDifference < 48) {
    throw new Error("Booking cannot be cancelled within 48 hours of check-in.");
  }

  const { error: deleteError } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  return { message: `Booking with id ${id} cancelled successfully.` };
};

export const updateBooking = async (
  id: string | number,
  userId: string,
  newBookingData: Partial<Booking>
) => {
  // First, verify the user is authorized and the booking is changeable
  const { data: existingBooking, error: fetchError } = await supabase
    .from("bookings")
    .select("user_id, check_in_date")
    .eq("id", id)
    .single();

  if (fetchError || !existingBooking) {
    throw new Error(fetchError?.message || "Booking not found.");
  }

  if (existingBooking.user_id !== userId) {
    throw new Error("You are not authorized to update this booking.");
  }

  const checkInDate = new Date(existingBooking.check_in_date);
  const now = new Date();
  const hoursDifference =
    (checkInDate.getTime() - now.getTime()) / (1000 * 3600);

  if (hoursDifference < 48) {
    throw new Error("Booking cannot be changed within 48 hours of check-in.");
  }

  // Defines the mapping from frontend camelCase to backend snake_case
  const keyMapping: { [key: string]: string } = {
    checkInDate: "check_in_date",
    checkOutDate: "check_out_date",
    numberOfGuests: "number_of_guests",
    guestFullName: "guest_full_name",
    guestEmail: "guest_email",
    guestPhoneNumber: "guest_phone_number",
  };

  const updateData: { [key: string]: any } = {};

  // Loop over the keys in the incoming data and build the update object
  for (const key in newBookingData) {
    if (Object.prototype.hasOwnProperty.call(newBookingData, key)) {
      const typedKey = key as keyof Booking;
      const value = newBookingData[typedKey];

      const mappedKey = keyMapping[typedKey] || typedKey;
      updateData[mappedKey] = value;
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update provided.");
  }

  // Send the dynamically built object to the database
  const { data: updatedBooking, error: updateError } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", id)
    .select("*, properties(*)")
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return updatedBooking;
};
