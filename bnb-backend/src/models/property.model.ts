export interface Property {
  id: number;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  pricePerExtraGuest: number;
  availability: Date[]; // Represents an array of available dates
  imageUrl: string;
  userId: string;
}
