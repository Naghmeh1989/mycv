import { IsString, IsArray } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class CreateMovieDto{
  @ApiProperty()
  @IsString()
  title:string;

  @ApiProperty()
  @IsArray()
  genreIds:number[];
}