import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, ValidateIf } from 'class-validator';

export class GenerateTokenDTO {
  @ApiProperty({
    type: String,
    required: true,
    example:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6HJDFJOAD.eyJzdWIiOjQsImVtYWlsIjoidGVzdC51c2VyQG1haWxpbmF0b3IuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM0OTU2MTQ1LCJleHAiOjE3NDAxNDAxNDV9.A9MMqvJOMErNTg2AtthMcdSYqFrTzfvA9ZKBSuBaU1S-T6E9MSJThweSun0gYCIyBlXejlD4FhvNYveYekUmpqaLm5TwahXk6-iSgByeB_eP0d413AIOgR-hH65DMxx308FKpSFvf0Z4EXC6aez4yMlZrSyCQd50Mms-UeXuarSnihdTzV6OtG3VZuHFpkmGXYDdwCe9Uf5TMbt0KzWCfWzW8JsfiStY1zrOyabNQO0ypBHtb5IZGfT6Umq8LpdnJpLjw-A8Il4y8nGESS-AIoKpADZVNd9GqWqZTEm1g0rZzR4VttXFgwbXaZbA1Cyl_Ue35C8AkG-cJdMMmg',
  })
  @IsString()
  refreshToken: string;
}
