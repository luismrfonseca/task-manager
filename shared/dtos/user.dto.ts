import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserDTO {
    id!: string;
    email!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

export class CreateUserDTO {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(8)
    @IsOptional()
    password?: string;
}
