 interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;

  dateOfBirth?: string;
  profileImage?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

 interface UpdateProfileRequest {
  firstName: string;
  lastName: string;

  dateOfBirth?: string;
}

 interface UsersResponse {
  users: User[];
  total: number;
  pages: number;
  currentPage: number;
}