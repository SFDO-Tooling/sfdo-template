import routes, { routePatterns } from 'utils/routes';

describe('routes', () => {
  [{ name: 'home', args: [], expected: '/' }].forEach(
    ({ name, args, expected }) => {
      test(`${name} returns path with args: ${args.join(', ')}`, () => {
        expect(routes[name](...args)).toBe(expected);
      });
    },
  );
});

describe('routePatterns', () => {
  [
    { name: 'home', expected: '/' },
    {
      name: 'auth_error',
      expected: '/accounts/salesforce-(custom|production|test)/login/callback',
    },
  ].forEach(({ name, expected }) => {
    test(`${name} returns path`, () => {
      expect(routePatterns[name]()).toBe(expected);
    });
  });
});
