import { IsNumber, Min } from 'class-validator';

export class TransactionDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount!: number;
}