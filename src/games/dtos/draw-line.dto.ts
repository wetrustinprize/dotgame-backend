import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { LinePosition } from 'games/models/square.model';

// Coordinate regex
// Check if follows pattern:
// 30,30T | X,YP | P = position, can be Bottom, Top, Left, Right
export const CoordinateRegex = /[0-9]+,[0-9]+[TLBR]/;

@ArgsType()
export class DrawLineDTO {
  @Field(() => Number, { description: 'The X position of the square' })
  @IsNumber()
  @Min(0)
  x: number;

  @Field(() => Number, { description: 'The Y position of the square' })
  @IsNumber()
  @Min(0)
  y: number;

  @Field(() => LinePosition, { description: 'The line position in the square' })
  @IsEnum(LinePosition)
  linePosition: LinePosition;
}
