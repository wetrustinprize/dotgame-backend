import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'A entry in the scoreboard' })
export class ScoreboardEntry {
  @Field(() => String, { nullable: false })
  playerId: string;

  @Field(() => Number, { nullable: false })
  score: number;

  @Field(() => Number, { nullable: false })
  totalLines: number;

  constructor(playerId: string, score: number, totalLines: number) {
    this.playerId = playerId;
    this.score = score;
    this.totalLines = totalLines;
  }
}
