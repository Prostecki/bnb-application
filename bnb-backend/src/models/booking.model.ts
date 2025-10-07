import type { User } from "./user.model.js";
import type { Property } from "./property.model.js";

export interface Booking {
  id: number;
  createdAt: Date;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  userId?: string; // Make userId optional for unauthenticated bookings
  propertyId: number;
  guestEmail: string;
  guestFullName: string;
  guestPhoneNumber: string;
  user?: User;
  property?: Property;
}
