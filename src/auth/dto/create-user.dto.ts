import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, ValidateIf } from 'class-validator';
import { UserRole } from '../entities/users.user.entity';
import { CreateCompanyDto } from './create-company.dto';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true, example: 'Test' })
  @IsString()
  firstName: string;

  @ApiProperty({ type: String, required: true, example: 'User' })
  @IsString()
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

  @ApiProperty({ enum: UserRole, required: true, example: 'Test@123' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ type: CreateCompanyDto })
  @ValidateIf((obj) => obj.role === UserRole.ADMIN)
  comapnyDetails: CreateCompanyDto;
}
