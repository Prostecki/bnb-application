import type { Property } from "./property.model";

export interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  guestFullName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  properties: Property | null;
}