import { IsString } from 'class-validator';

export class CancelTransactionDto {
  @IsString()
  transactionId!: string;
}