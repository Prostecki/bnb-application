import { supabase } from "../../lib/supabase.js";
import type { Property } from "../../models/property.model.js";

export const getProperties = async () => {
  const { data, error } = await supabase.from("properties").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const createProperty = async (
  property: Omit<Property, "id" | "userId">,
  userId: string
) => {
  const propertyToCreate = { ...property, user_id: userId };
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
  // First, verify the user owns the property
  const { data: existingProperty, error: fetchError } = await supabase
    .from("properties")
    .select("user_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (existingProperty.user_id !== userId) {
    throw new Error("You are not authorized to update this property.");
  }

  // If authorized, update the property
  const { data, error } = await supabase
    .from("properties")
    .update(property)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteProperty = async (id: string, userId: string) => {
  // First, verify the user owns the property
  const { data: existingProperty, error: fetchError } = await supabase
    .from("properties")
    .select("user_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (existingProperty.user_id !== userId) {
    throw new Error("You are not authorized to delete this property.");
  }

  // If authorized, delete the property
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  return { message: `Property with id ${id} deleted successfully` };
};
