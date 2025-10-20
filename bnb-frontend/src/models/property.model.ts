export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  pricePerExtraGuest: number;
  imageUrl: string;
  userId: string;
  user: {
    name: string;
  };
  availability: string[];
  stillAvailableDates: string[];
  bookedDates: string[];
}
