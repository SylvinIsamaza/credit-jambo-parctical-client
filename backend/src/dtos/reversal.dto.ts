import { IsString, IsNotEmpty } from 'class-validator';

export class ReverseTransactionDto {
  @IsString()
  @IsNotEmpty({ message: 'Reason is required' })
  reason!: string;
}