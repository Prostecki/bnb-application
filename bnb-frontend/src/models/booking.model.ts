export interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_price: number;
  guestFullName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  numberOfGuests: number;
  properties: {
    name: string;
    image_url: string;
  } | null;
}
