import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @MinLength(6)
    password: string;
}
