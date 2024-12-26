import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsOptional()
  id?: number;

  @ApiProperty({ type: String, required: true, example: 'Test Company' })
  @ValidateIf((obj) => !obj.id)
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'This is the test company',
  })
  @ValidateIf((obj) => !obj.id)
  @IsString()
  about: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'http://localhost.test.com',
  })
  @IsOptional()
  logoUrl: string;
}
