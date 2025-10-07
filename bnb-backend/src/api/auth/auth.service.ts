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

  // Добавляем информацию о пользователе к ответу
  return {
    ...authData,
    user: {
      ...authData.user,
      name: name,
      is_admin: false,
    },
  };
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

  // Получаем информацию о пользователе из таблицы users
  if (data.user) {
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, name, email, is_admin")
        .eq("id", data.user.id)
        .single();

      if (!userError && userData) {
        // Добавляем информацию о пользователе к ответу
        return {
          ...data,
          user: {
            ...data.user,
            name: userData.name,
            is_admin: userData.is_admin,
          },
        };
      }
    } catch (userErr) {
      console.error("Error fetching user profile:", userErr);
    }
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

export const getCurrentUser = async (accessToken: string) => {
  try {
    // Получаем пользователя из Supabase Auth используя токен
    const { data: authUser, error: authError } = await supabase.auth.getUser(
      accessToken
    );

    if (authError || !authUser.user) {
      throw new Error("Invalid or expired token");
    }

    // Получаем дополнительную информацию о пользователе из таблицы users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, name, email, is_admin")
      .eq("id", authUser.user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      // Если не удалось получить данные из таблицы users, возвращаем базовую информацию
      return {
        id: authUser.user.id,
        email: authUser.user.email,
        name: authUser.user.user_metadata?.name || "User",
        is_admin: false,
      };
    }

    return userData;
  } catch (error: any) {
    throw new Error(`Failed to get current user: ${error.message}`);
  }
};
