import { supabase } from "../../lib/supabase.js";
import type { Property } from "../../models/property.model.js";
import type { User } from "../../models/user.model.js";

interface PropertyFromDb {
  id: number;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  price_per_extra_guest: number;
  image_url: string;
  user_id: string;
  availability: string[] | null; // Array of date strings from database
  user: User;
}

const mapToCamelCase = (property: PropertyFromDb): Property => ({
  id: property.id,
  name: property.name,
  description: property.description,
  location: property.location,
  pricePerNight: property.price_per_night,
  pricePerExtraGuest: property.price_per_extra_guest,
  imageUrl: property.image_url,
  userId: property.user_id,
  user: property.user,
  availability: property.availability || [], // Use availability from database or empty array
});

export const getProperties = async () => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, availability, user:users(*)");
  if (error) {
    throw new Error(error.message);
  }
  return data.map(mapToCamelCase);
};

export const getPropertiesByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, availability, user:users(*)")
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  return data.map(mapToCamelCase);
};

export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, availability, user:users(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return mapToCamelCase(data);
};

export const createProperty = async (
  property: Omit<Property, "id" | "userId">,
  userId: string
) => {
  const {
    name,
    description,
    location,
    pricePerNight,
    pricePerExtraGuest,
    imageUrl,
    availability, // Added availability
  } = property;
  const propertyToCreate = {
    name,
    description,
    location,
    price_per_night: pricePerNight,
    price_per_extra_guest: pricePerExtraGuest,
    image_url: imageUrl,
    user_id: userId,
    availability: availability || [], // Added availability
  };
  const { data, error } = await supabase
    .from("properties")
    .insert([propertyToCreate])
    .select();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateProperty = async (
  id: string,
  property: Partial<Property>,
  userId: string
) => {
  // 1. Create an object with all possible fields mapped.
  const propertyToUpdate: { [key: string]: any } = {
    name: property.name,
    description: property.description,
    location: property.location,
    price_per_night: property.pricePerNight,
    price_per_extra_guest: property.pricePerExtraGuest,
    image_url: property.imageUrl,
    availability: property.availability,
  };

  // 2. Remove any property that wasn't included in the form data.
  Object.keys(propertyToUpdate).forEach((key) => {
    if (propertyToUpdate[key as keyof typeof propertyToUpdate] === undefined) {
      delete propertyToUpdate[key as keyof typeof propertyToUpdate];
    }
  });

  if (Object.keys(propertyToUpdate).length === 0) {
    throw new Error("No fields to update provided.");
  }

  // 3. Send the cleaned object to the database.
  const { data, error } = await supabase
    .from("properties")
    .update(propertyToUpdate)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteProperty = async (id: string, userId: string) => {
  // RLS policies in the database will handle authorization.
  // The manual check `if (existingProperty.user_id !== userId)` has been removed.

  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  return { message: `Property with id ${id} deleted successfully` };
};
