import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCourtDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
