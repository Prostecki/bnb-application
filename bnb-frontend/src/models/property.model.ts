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
  user?: User;
}
