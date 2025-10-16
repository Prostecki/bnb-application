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
  availability: [], // Assuming availability is not stored directly
});

export const getProperties = async () => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, user:users(*)");
  if (error) {
    throw new Error(error.message);
  }
  return data.map(mapToCamelCase);
};

export const getPropertiesByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, user:users(*)")
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  return data.map(mapToCamelCase);
};

export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, user:users(*)")
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
  } = property;
  const propertyToCreate = {
    name,
    description,
    location,
    price_per_night: pricePerNight,
    price_per_extra_guest: pricePerExtraGuest,
    image_url: imageUrl,
    user_id: userId,
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
  // RLS policies in the database will handle authorization.
  // The manual check `if (existingProperty.user_id !== userId)` has been removed.

  const {
    name,
    description,
    location,
    pricePerNight,
    pricePerExtraGuest,
    imageUrl,
  } = property;
  const propertyToUpdate = {
    name,
    description,
    location,
    price_per_night: pricePerNight,
    price_per_extra_guest: pricePerExtraGuest,
    image_url: imageUrl,
  };

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
