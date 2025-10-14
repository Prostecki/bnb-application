export interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  properties: {
    name: string;
    image_url: string;
  } | null;
}
