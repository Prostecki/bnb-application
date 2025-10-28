import { supabase } from "../../lib/supabase.js";
import type { Property } from "../../models/property.model.js";
import type { User } from "../../models/user.model.js";
import { eachDayOfInterval, format } from "date-fns";

interface PropertyFromDb {
  id: number;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  price_per_extra_guest: number;
  image_url: string;
  user_id: string;
  availability: string[] | null;
  additional_images: string[] | null;
  user: User;
  bookings: any[]; // Comes from the join
}

const mapToCamelCase = (property: PropertyFromDb): any => ({
  id: property.id,
  name: property.name,
  description: property.description,
  location: property.location,
  pricePerNight: property.price_per_night,
  pricePerExtraGuest: property.price_per_extra_guest,
  imageUrl: property.image_url,
  userId: property.user_id,
  user: property.user,
  availability: property.availability || [],
  additionalImages: property.additional_images || [],
  bookings: property.bookings || [],
});

export const getProperties = async (search?: string) => {
  let query = supabase.from("properties").select("*, availability, user:users(*)");

  if (search) {
    query = query.ilike("location", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }
  return data.map(mapToCamelCase);
};

export const getPropertiesByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, availability, user:users(*), bookings(*)")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const processedData = data.map((property) => {
    const camelCased = mapToCamelCase(property as any);

    const bookedDateStrings = new Set(
      camelCased.bookings?.flatMap((b: any) =>
        eachDayOfInterval({
          start: new Date(b.check_in_date),
          end: new Date(b.check_out_date),
        })
          .slice(0, -1) // Exclude check-out day
          .map((d: Date) => format(d, "yyyy-MM-dd"))
      ) || []
    );

    const stillAvailableDates = camelCased.availability.filter(
      (availDate: string) => !bookedDateStrings.has(availDate)
    );

    return {
      ...camelCased,
      stillAvailableDates,
      bookedDates: Array.from(bookedDateStrings).sort(),
      bookings: undefined, // Remove original bookings array
    };
  });

  return processedData;
};

export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, availability, user:users(*), bookings(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const camelCased = mapToCamelCase(data as any);

  const bookedDateStrings = new Set(
    camelCased.bookings?.flatMap((b: any) =>
      eachDayOfInterval({
        start: new Date(b.check_in_date),
        end: new Date(b.check_out_date),
      })
        .slice(0, -1) // Exclude check-out day
        .map((d: Date) => format(d, "yyyy-MM-dd"))
    ) || []
  );

  const stillAvailableDates = camelCased.availability.filter(
    (availDate: string) => !bookedDateStrings.has(availDate)
  );

  return {
    ...camelCased,
    stillAvailableDates,
    bookedDates: Array.from(bookedDateStrings).sort(),
    bookings: undefined,
  };
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
    additionalImages,
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
    additional_images: additionalImages || [],
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
    additional_images: property.additionalImages,
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
