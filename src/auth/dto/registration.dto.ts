import { ApiProperty } from '@nestjs/swagger';

export class RegistrationDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
