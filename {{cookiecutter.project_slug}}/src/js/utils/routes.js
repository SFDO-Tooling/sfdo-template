// @flow

const routes = {
  home: () => '/',
};

export const routePatterns = {
  home: () => '/',
  auth_error: () =>
    '/accounts/salesforce-(custom|production|test)/login/callback',
};

export default routes;
