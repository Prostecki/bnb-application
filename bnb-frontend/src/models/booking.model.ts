export interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  guestFullName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  properties: {
    name: string;
    image_url: string; // This can remain as is, as it's a nested property from another table
  } | null;
}