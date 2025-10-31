import { IsString, Matches, Length } from 'class-validator';

export class SetPinDto {
  @IsString()
  @Length(4, 4, { message: 'PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'PIN must contain only digits' })
  pin!: string;
}

export class ChangePinDto {
  @IsString()
  @Length(4, 4, { message: 'Current PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'Current PIN must contain only digits' })
  currentPin!: string;

  @IsString()
  @Length(4, 4, { message: 'New PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'New PIN must contain only digits' })
  newPin!: string;
}

export class VerifyPinDto {
  @IsString()
  @Length(4, 4, { message: 'PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'PIN must contain only digits' })
  pin!: string;
}