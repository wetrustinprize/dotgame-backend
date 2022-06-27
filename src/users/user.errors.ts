import { BadRequestException, NotFoundException } from '@nestjs/common';

export const UserNotFoundError = new NotFoundException('user_not_found');
export const UsernameInUseError = new BadRequestException('username_in_use');
