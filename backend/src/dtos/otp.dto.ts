import { IsString, IsIn, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must contain only digits' })
  code!: string;

  @IsString()
  @IsIn(['LOGIN', 'TRANSACTION', 'DEVICE_VERIFICATION'])
  type!: 'LOGIN' | 'TRANSACTION' | 'DEVICE_VERIFICATION';
}

export class GenerateOtpDto {
  @IsString()
  @IsIn(['LOGIN', 'TRANSACTION', 'DEVICE_VERIFICATION'])
  type!: 'LOGIN' | 'TRANSACTION' | 'DEVICE_VERIFICATION';
}