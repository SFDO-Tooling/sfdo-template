import routes, { routePatterns } from '@/utils/routes';

describe('routes', () => {
  test.each([['home', [], '/']])(
    '%s returns path with args: %o',
    (name, args, expected) => {
      expect(routes[name](...args)).toBe(expected);
    },
  );
});

describe('routePatterns', () => {
  test.each([['home', '/'], ['auth_error', '/accounts/*']])(
    '%s returns path',
    (name, expected) => {
      expect(routePatterns[name]()).toBe(expected);
    },
  );
});
