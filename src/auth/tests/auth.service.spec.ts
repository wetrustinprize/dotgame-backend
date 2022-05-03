import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'auth/auth.service';
import { PrismaService } from 'prisma.service';

describe('Auth Service', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  const testUser = {
    id: '1',
    username: 'test',
    password: 'test',
  };

  beforeEach(() => {
    jwtService = new JwtService({});
    prismaService = new PrismaService({});

    jest.spyOn(jwtService, 'sign').mockReturnValue('token');
    jest.spyOn(jwtService, 'verify').mockReturnValue({});

    service = new AuthService(prismaService, jwtService);
  });

  it('should sign in', async () => {
    // Mock prisma
    prismaService.user.findUnique = jest.fn().mockReturnValueOnce(testUser);

    // Mock bcrypt
    service.validatePassword = jest.fn().mockReturnValue(true);

    // Call service
    const result = await service.signIn({ password: 'test', username: 'test' });

    // Expect
    expect(result).toEqual({
      token: 'token',
      user: {
        id: '1',
        username: 'test',
      },
    });
  });

  it('should error if password incorrect', async () => {
    // Mock prisma
    prismaService.user.findUnique = jest.fn().mockReturnValueOnce(testUser);

    // Mock bcrypt
    service.validatePassword = jest.fn().mockReturnValue(false);

    // Call service and expect
    await expect(
      service.signIn({ password: 'test', username: 'test' }),
    ).rejects.toThrow('password_incorrect');
  });
});
