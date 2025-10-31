import { IsString, Length, Matches } from 'class-validator';

export class TransactionPinDto {
  @IsString()
  transactionId!: string;

  @IsString()
  @Length(4, 4, { message: 'PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'PIN must contain only digits' })
  pin!: string;
}