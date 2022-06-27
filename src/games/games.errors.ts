import { BadRequestException } from '@nestjs/common';

export const AlreadyOwnsGameError = new BadRequestException(
  'already_owns_game',
);
export const AlreadyInGameError = new BadRequestException('already_in_game');
export const NoGameInWaitingError = new BadRequestException(
  'no_game_in_waiting',
);
