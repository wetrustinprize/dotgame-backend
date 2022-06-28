import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class JoinGameDto {
  @Field()
  @IsUUID()
  id: string;
}
