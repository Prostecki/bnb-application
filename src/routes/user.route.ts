import { Hono } from "hono";
import { supabase } from "../lib/supabase.js";

const userRouter = new Hono();

userRouter.post("/signup", async (c) => {
  const { email, password, name } = await c.req.json();

  if (!email || !password || !name) {
    return c.json({ error: "Email, password, and name are required!" }, 400);
  }

  // --- STEP 1: Sign up the user in Supabase Auth ---
  // This function creates a user in the internal 'auth.users' table in Supabase.
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return c.json({ error: authError.message }, 500);
  }

  if (!authData.user) {
    return c.json(
      { error: "Signup successful, but no user data returned." },
      500
    );
  }

  // --- STEP 2: Add the user profile to your public 'users' table ---
  // Now we take the ID from the created auth user and use it
  // to create a record in your 'users' table.
  const { error: profileError } = await supabase
    .from("users") // Specify your table
    .insert([
      {
        id: authData.user.id, // ID from Supabase Auth
        name: name, // Name from the request
        email: authData.user.email, // Email from Supabase Auth
        is_admin: false, // Default value
      },
    ]);

  if (profileError) {
    // If creating the profile fails, this can cause problems.
    // In a real application, you might want to delete the user from auth.users here.
    console.error("Error creating user profile:", profileError);
    return c.json(
      { error: "Failed to create user profile after signup." },
      500
    );
  }

  // Return the session data from Supabase Auth
  return c.json(authData, 201);
});

userRouter.post("/signin", async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return c.json({ error: error.message }, 401);
  }

  return c.json(data);
});

export default userRouter;
