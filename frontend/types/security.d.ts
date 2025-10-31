 interface SetPinRequest {
  pin: string;
}

 interface ChangePinRequest {
  currentPin: string;
  newPin: string;
}

 interface GenerateOtpRequest {
  type: string;
}

 interface VerifyOtpRequest {
  code: string;
  type: string;
}

 interface Device {
  id: string;
  name: string;
  userAgent: string;
  ipAddress: string;
  isVerified: boolean;
  lastUsed: string;
  createdAt: string;
}

 interface Session {
  id: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
}