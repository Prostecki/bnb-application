export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // For security, this should be a password hash
  isAdmin: boolean;
  description: string;
  location: string;
}

export type UserCredentials = Omit<User, "id" | "isAdmin">;
