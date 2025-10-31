import { IsNumber, IsOptional, Min } from 'class-validator';

export class SetLimitsDto {
  @IsOptional()
  @IsNumber({}, { message: 'Daily limit must be a number' })
  @Min(0, { message: 'Daily limit must be positive' })
  dailyLimit?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Monthly limit must be a number' })
  @Min(0, { message: 'Monthly limit must be positive' })
  monthlyLimit?: number;
}

