export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // For security, this should be a password hash
  isAdmin: boolean;
}
