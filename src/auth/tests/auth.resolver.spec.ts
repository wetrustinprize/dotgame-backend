import { AuthResolver } from 'auth/auth.resolver';
import { AuthService } from 'auth/auth.service';

describe('Auth Resolver', () => {
  let resolver: AuthResolver;

  beforeEach(() => {
    resolver = new AuthResolver({} as AuthService);
  });

  it('Should not accept empty username', () => {
    expect(
      resolver.signIn({ password: 'test', username: '' }),
    ).rejects.toThrow();
  });

  it('Should not accept empty password', () => {
    expect(
      resolver.signIn({ password: '', username: 'test' }),
    ).rejects.toThrow();
  });
});
