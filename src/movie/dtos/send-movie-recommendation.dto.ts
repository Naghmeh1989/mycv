import { IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class SendRecommendationDto{
  @ApiProperty()
  @IsNumber()
  genreId:number;

  @ApiProperty()
  @IsNumber()
  userId:number;
}