import { ArgsType, Field } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class CreateBoardDTO {
  @Field(() => Number, { description: 'The height of the board.' })
  @Min(1)
  height: number;

  @Field(() => Number, { description: 'The width of the board.' })
  @Min(1)
  width: number;
}
