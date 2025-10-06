import { supabase } from "../../lib/supabase.js";
import type { UserCredentials } from "../../models/user.model.ts";

export const signUpUser = async (credentials: UserCredentials) => {
  const { email, password, name } = credentials;

  if (!email || !password || !name) {
    throw new Error("Email, password, and name are required!");
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error("Signup successful, but no user data returned.");
  }

  const { error: profileError } = await supabase.from("users").insert([
    {
      id: authData.user.id,
      name: name,
      email: authData.user.email,
      is_admin: false,
    },
  ]);

  if (profileError) {
    console.error("Error creating user profile:", profileError);
    throw new Error("Failed to create user profile after signup.");
  }

  return authData;
};

export const signInUser = async (
  credentials: Omit<UserCredentials, "name">
) => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const forgotPasswordService = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.FRONTEND_URL + "/reset-password",
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const signOutService = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};
