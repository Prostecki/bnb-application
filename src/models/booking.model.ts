import type { User } from "./user.model.js";
import type { Property } from "./property.model.js";

export interface Booking {
  id: number;
  createdAt: Date;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  userId: number;
  propertyId: number;
  user?: User;
  property?: Property;
}
