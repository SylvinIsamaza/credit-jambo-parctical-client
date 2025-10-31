export interface CustomerRegistrationDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  deviceId: string;
}

export interface CustomerLoginDto {
  email: string;
  password: string;
  deviceId: string;
}

export interface CustomerResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: any;
  isVerified: boolean;
  createdAt: Date;
}

export interface TransactionResponseDto {
  id: string;
  refId: string;
  type: string;
  amount: string;
  description?: string;
  createdAt: Date;
}