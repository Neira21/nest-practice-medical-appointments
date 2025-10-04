export interface AuthUser {
  id: number;
  username: string;
  email: string;
  roleId: number;
  role?: {
    id: number;
    name: string;
  };
}
