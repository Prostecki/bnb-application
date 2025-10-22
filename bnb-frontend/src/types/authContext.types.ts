import type { User } from "@/models/user.model";
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData?: User) => void;
  logout: () => void;
  loading: boolean;
}
