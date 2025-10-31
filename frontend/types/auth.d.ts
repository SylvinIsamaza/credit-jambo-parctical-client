 interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
  loginOtp?: string;
}

 interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  deviceId?: string;
}

 interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  requiresOtp?: boolean;
  userId?: string;
}

 interface RegisterResponse {
  message: string;
}

 interface Step1Form {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

 interface Step2Form {
  email: string;
  password: string;
  confirmPassword: string;
}