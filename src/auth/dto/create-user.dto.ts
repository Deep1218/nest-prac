import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { users_role_enum } from 'prisma/user/client';
import { CreateCompanyDto } from './create-company.dto';

export class CreateUserDto {
  @ApiProperty({ type: String, required: false, example: 'Test' })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ type: String, required: false, example: 'User' })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'test.user@mailinator.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true, example: 'Test@123' })
  @IsString()
  password: string;

  @ApiProperty({
    enum: users_role_enum,
    required: true,
    example: users_role_enum.admin,
  })
  @IsEnum(users_role_enum)
  @IsOptional()
  role: users_role_enum;

  @ApiProperty({ type: CreateCompanyDto })
  @ValidateIf((obj) => obj.role === users_role_enum.admin)
  companyDetails: CreateCompanyDto;
}
