import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  message!: string;

  @IsOptional()
  @IsString()
  transactionRefId?: string;
}