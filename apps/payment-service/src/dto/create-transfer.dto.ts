import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateTransferDto {
    @IsUUID()
    @IsNotEmpty()
    receiverId: string;

    @IsNumber()
    @Min(0.001)
    amount: number;

    @IsString()
    @IsOptional()
    description?: string;
}
