import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    content: string;

    @IsNumber()
    @IsOptional()
    author_id: number

}
