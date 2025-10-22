export interface BookingSnakeCase {
  id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_price: number;
  guest_full_name: string;
  guest_email: string;
  guest_phone_number: string;
  properties: {
    name: string;
    image_url: string;
  } | null;
}
