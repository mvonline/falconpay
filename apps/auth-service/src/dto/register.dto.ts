import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @MinLength(6)
    password: string;
}
