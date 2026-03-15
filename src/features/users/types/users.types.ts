export interface User {
  id: string;
  fullName: string;
  email: string;
  roleName: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
}
