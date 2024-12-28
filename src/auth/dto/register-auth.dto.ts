import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class RegisterAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(12)
    pas: string;

    @IsString()
    @IsOptional()
    @MaxLength(12)
    username: string;

}