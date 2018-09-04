// @flow

import * as React from 'react';
import PageHeader from '@salesforce/design-system-react/components/page-header';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import routes from 'utils/routes';
import { logout } from 'accounts/actions';

import Login from 'components/header/login';
import Logout from 'components/header/logout';

import type { User } from 'accounts/reducer';

const Header = ({
  user,
  doLogout,
}: {
  user: User,
  doLogout: typeof logout,
}) => (
  <PageHeader
    className="page-header"
    title={
      <Link
        to={routes.home()}
        className="slds-page-header__title
          slds-text-heading_large
          slds-text-link_reset"
      >
        <span>{{cookiecutter.project_name}}</span>
      </Link>
    }
    navRight={
      <div>
        {user && user.username ? (
          <Logout user={user} doLogout={doLogout} />
        ) : (
          <Login />
        )}
      </div>
    }
    variant="objectHome"
  />
);

const selectUserState = (appState): User => appState.user;

const select = appState => ({
  user: selectUserState(appState),
});

const actions = {
  doLogout: logout,
};

export default connect(
  select,
  actions,
)(Header);
