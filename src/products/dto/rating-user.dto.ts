import { IsNotEmpty, IsInt, IsPositive, Max } from 'class-validator';

export class RatingDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Max(5)
  rating: number;
}
