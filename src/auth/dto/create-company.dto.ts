import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ type: String, required: true, example: 'Test Company' })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'This is the test company',
  })
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
