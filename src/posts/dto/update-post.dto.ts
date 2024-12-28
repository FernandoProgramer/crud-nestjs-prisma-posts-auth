import { IsOptional, IsString } from "class-validator";


export class UpdatePostDto {
    @IsOptional() // por si existe
    @IsString()
    title?: string;

    @IsOptional() // por si existe
    @IsString()
    content?: string;

}
