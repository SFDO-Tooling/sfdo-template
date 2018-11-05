// @flow

import * as React from 'react';
import PageHeader from '@salesforce/design-system-react/components/page-header';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import routes from 'utils/routes';
import { logout } from 'accounts/actions';

import Login from 'components/header/login';
import Logout from 'components/header/logout';

import type { AppState } from 'app/reducer';
import type { User } from 'accounts/reducer';

type Props = {
  user: User,
  doLogout: typeof logout,
};

const Header = ({ user, doLogout }: Props) => (
  <PageHeader
    className="global-header
      slds-p-horizontal_x-large
      slds-p-vertical_medium"
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
      <>{user ? <Logout user={user} doLogout={doLogout} /> : <Login />}</>
    }
    variant="objectHome"
  />
);

const selectUserState = (appState: AppState): User => appState.user;

const select = (appState: AppState) => ({
  user: selectUserState(appState),
});

const actions = {
  doLogout: logout,
};

const WrappedHeader: React.ComponentType<{}> = connect(
  select,
  actions,
)(Header);

export default WrappedHeader;
