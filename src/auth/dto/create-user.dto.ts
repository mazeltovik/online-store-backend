import {
  IsAlpha,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Contains,
} from 'class-validator';
import { MatchDomainPattern } from 'src/helpers/authPatterns/matchDomainPattern';
import { MatchEmailPattern } from 'src/helpers/authPatterns/matchEmailPattern';
import { MatchSpacePattern } from 'src/helpers/authPatterns/matchSpacePattern';
import { MatchLowerCasePattern } from 'src/helpers/authPatterns/matchLowerCasePattern';
import { MatchUpperCasePattern } from 'src/helpers/authPatterns/matchUpperCasePattern';
import { MatchDigitPattern } from 'src/helpers/authPatterns/matchDigitPattern';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsAlpha()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MatchDomainPattern({
    message: 'Email address must have a valid domain address',
  })
  @MatchEmailPattern({ message: 'Email address must have a valid address' })
  @MatchSpacePattern({ message: 'Email must not contain whitespaces' })
  @Contains('@')
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MatchSpacePattern({ message: 'Password must not contain whitespaces' })
  @MatchLowerCasePattern({ message: 'Password should have a-z characters' })
  @MatchUpperCasePattern({ message: 'Password should have A-Z characters' })
  @MatchDigitPattern({ message: 'Password should have more than one digit' })
  password: string;
}
