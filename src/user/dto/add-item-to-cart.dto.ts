import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsPositive,
  IsUUID,
  Contains,
} from 'class-validator';
export class AddItemToCartDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  productId: string;
  @IsNotEmpty()
  @IsString()
  @Contains('clr_', {
    message: 'Wrong color',
  })
  color: 'clr_ff0000' | 'clr_00ff00' | 'clr_0000ff' | 'clr_000' | 'clr_ffb900';

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  amount: number;
}
