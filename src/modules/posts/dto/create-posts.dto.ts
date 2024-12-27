import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ type: String, required: true, example: 'test-post' })
  @IsString()
  title: string;

  @ApiProperty({ type: String, required: true, example: 'test-description' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'http://localhost.test.com',
  })
  @IsOptional()
  @IsString()
  mediaUrl: string;

  // @ApiProperty({
  //   type: [Number],
  //   required: false,
  //   example: [1, 2],
  // })
  // @IsOptional()
  // @IsArray()
  // @IsNumber({}, { each: true })
  // tags: number[];
}
