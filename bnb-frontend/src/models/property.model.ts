import type { Booking } from "./booking.model";
import type { User } from "./user.model";

export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  pricePerExtraGuest: number;
  imageUrl: string;
  userId: string;
  user: User;
  availability: string[];
  stillAvailableDates: string[];
  bookedDates: string[];
  additionalImages: string[];
  rating: number;
  bookings: Booking[];
}
