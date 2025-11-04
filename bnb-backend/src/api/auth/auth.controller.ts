import { type Context } from "hono";
import {
  signUpUser,
  signInUser,
  forgotPasswordService,
  signOutService,
  getCurrentUser,
  updateProfileService,
} from "./auth.service.js";
import type { UserCredentials } from "../../models/user.model.ts";
import { supabase } from "../../lib/supabase.js";

export const signUpController = async (c: Context) => {
  try {
    const credentials = await c.req.json<UserCredentials>();
    const data = await signUpUser(credentials);
    return c.json(data, 201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "An unknown error occurred" }, 400);
  }
};

export const signInController = async (c: Context) => {
  try {
    //Omit - exclude something that we don't want to have,
    const credentials = await c.req.json<Omit<UserCredentials, "name">>();
    const data = await signInUser(credentials);
    return c.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 401);
    }
    return c.json({ error: "An unknown error occurred" }, 401);
  }
};

export const forgotPasswordController = async (c: Context) => {
  try {
    const { email } = await c.req.json<{ email: string }>();
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    await forgotPasswordService(email);
    return c.json({ message: "Password reset email sent" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "An unknown error occurred" }, 500);
  }
};

export const resetPasswordController = async (c: Context) => {
  try {
    const { email } = await c.req.json<{ email: string }>();
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    await forgotPasswordService(email);
    return c.json({ message: "Password reset email sent" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "An unknown error occurred" }, 500);
  }
};

export const signOutController = async (c: Context) => {
  try {
    await signOutService();
    return c.json({ message: "Signed out successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "An unknown error occurred" }, 500);
  }
};

export const getMeController = async (c: Context) => {
  try {
    // Get token from Authorization header
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    // Get actual user data from database
    const userData = await getCurrentUser(token);
    return c.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      isAdmin: userData.is_admin,
      description: userData.description,
      location: userData.location,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getMeController:", error.message);
      return c.json({ error: "Failed to get user information" }, 401);
    }
    console.error("Error in getMeController:", error);
    return c.json({ error: "Failed to get user information" }, 401);
  }
};

export const updateProfileController = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Authorization token required" }, 401);
    }
    const token = authHeader.substring(7);

    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const { description, location } = await c.req.json<{
      description?: string;
      location?: string;
    }>();

    await updateProfileService(user.id, { description, location });
    return c.json({ message: "Profile updated successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateProfileController:", error.message);
      return c.json({ error: "Failed to update profile" }, 500);
    }
    console.error("Error in updateProfileController:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
};
