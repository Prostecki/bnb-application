export interface User {
  id: string; // The ID from Supabase auth is a UUID string
  name: string;
  email: string;
  isAdmin?: boolean;
  description?: string;
  location?: string;
}
