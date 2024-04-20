import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsPositive,
  IsUUID,
  Contains,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RemovingItemDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  amount: number;
  @IsNotEmpty()
  @IsString()
  @Contains('clr_', {
    message: 'Wrong color',
  })
  color: 'clr_ff0000' | 'clr_00ff00' | 'clr_0000ff' | 'clr_000' | 'clr_ffb900';
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  productId: string;
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  userId: string;
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  id: string;
}

export class RemoveFromCartDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RemovingItemDto)
  removingItems: RemovingItemDto[];
}
