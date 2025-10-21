import type { User } from "./user.model.js";

export interface Property {
  id: number;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  pricePerExtraGuest: number;
  availability: string[]; // Array of date strings from database
  imageUrl: string;
  userId: string;
  user?: User;
  additionalImages: string[];
}
