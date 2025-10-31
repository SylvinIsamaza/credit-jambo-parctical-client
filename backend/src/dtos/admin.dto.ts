import { IsEmail, IsString, MinLength, Matches, IsNotEmpty, IsEnum } from 'class-validator';

export class AdminRegistrationDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' })
  password!: string;

  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  @IsString({ message: 'Registration secret must be a string' })
  @IsNotEmpty({ message: 'Registration secret is required' })
  registrationSecret!: string;

  @IsEnum(['ADMIN'], { message: 'Invalid role' })
  role!: string;
}