export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Role {
  id: number;
  roleName: string;
}

export interface StaffResponse {
  user: User;
  role: Role;
}  

export interface EmployeeCreationRequest {
  userEmail: string;
  roleId: number;
}