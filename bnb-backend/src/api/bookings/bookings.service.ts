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

  bookingData: Pick<

    Booking,

    |

      "propertyId"

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



  if (!checkInDate || !checkOutDate) {

    throw new Error("Check-in date and check-out date are required.");

  }

  if (numberOfGuests <= 0) {

    throw new Error("Number of guests must be at least 1.");

  }



  // 1. Fetch the property to get the price per night and price per extra guest

  const { data: property, error: propertyError } = await supabase

    .from("properties")

    .select("price_per_night, price_per_extra_guest")

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



  let basePrice = property.price_per_night;

  if (numberOfGuests > 1) {

    basePrice += (numberOfGuests - 1) * property.price_per_extra_guest;

  }



  const totalPrice = numberOfNights * basePrice;



  // 3. Create the new booking object

  const newBooking = {

    property_id: propertyId,

    user_id: userId,

    check_in_date: checkInDate,

    check_out_date: checkOutDate,

    number_of_guests: numberOfGuests,

    total_price: totalPrice,

    guest_email: guestEmail,

    guest_full_name: guestFullName,

    guest_phone_number: guestPhoneNumber,

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
    .eq("user_id", userId);

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
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteBooking = async (
  id: string,
  userId: string | null,
  guestEmail?: string,
  guestPhoneNumber?: string
) => {
  // 1. Fetch the booking by ID first
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("check_in_date, user_id, guest_email, guest_phone_number")
    .eq("id", id)
    .single();

  if (fetchError || !booking) {
    throw new Error(fetchError?.message || "Booking not found.");
  }

  // 2. Apply authorization logic
  let isAuthorized = false;
  if (userId && booking.user_id === userId) {
    // Authenticated user deleting their own booking
    isAuthorized = true;
  } else if (booking.user_id === null && guestEmail && guestPhoneNumber && booking.guest_email === guestEmail && booking.guest_phone_number === guestPhoneNumber) {
    // Unauthenticated booking, being deleted by an authenticated user providing matching guest details
    isAuthorized = true;
  }

  if (!isAuthorized) {
    throw new Error("You are not authorized to delete this booking.");
  }

  // 3. Check cancellation policy
  const checkInDate = new Date(booking.check_in_date);
  const now = new Date();
  const timeDifference = checkInDate.getTime() - now.getTime(); // Difference in milliseconds
  const hoursDifference = timeDifference / (1000 * 3600);

  if (hoursDifference < 48) {
    throw new Error("Booking cannot be cancelled within 48 hours of check-in.");
  }

  // 4. If authorized and within cancellation window, delete the booking
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { message: `Booking with id ${id} cancelled successfully.` };
};
