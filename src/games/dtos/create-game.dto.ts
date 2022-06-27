import { ArgsType, Field } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';

@ArgsType()
export class CreateGameDto {
  @Field()
  @IsNumber()
  @Min(6)
  height: number;

  @Field()
  @IsNumber()
  @Min(6)
  width: number;
}
