// @flow

import * as React from 'react';
import PageHeader from '@salesforce/design-system-react/components/page-header';
import i18n from 'i18next';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import routes from 'utils/routes';
import { clearErrors, removeError } from 'store/errors/actions';
import { logout } from 'store/user/actions';
import { selectErrors } from 'store/errors/selectors';
import { selectSocketState } from 'store/socket/selectors';
import { selectUserState } from 'store/user/selectors';
import Errors from 'components/apiErrors';
import Login from 'components/header/login';
import Logout from 'components/header/logout';
import OfflineAlert from 'components/offlineAlert';
import type { AppState } from 'store';
import type { ErrorType } from 'store/errors/reducer';
import type { Socket } from 'store/socket/reducer';
import type { User } from 'store/user/reducer';

type Props = {
  user: User,
  socket: Socket,
  errors: Array<ErrorType>,
  doLogout: typeof logout,
  doClearErrors: typeof clearErrors,
  doRemoveError: typeof removeError,
};

class Header extends React.Component<Props> {
  componentWillUnmount() {
    const { doClearErrors } = this.props;
    doClearErrors();
  }

  controls = () => {
    const { user, doLogout } = this.props;
    return user ? <Logout user={user} doLogout={doLogout} /> : <Login />;
  };

  render() {
    const { socket, errors, doRemoveError } = this.props;
    return (
      <>
        {socket ? null : <OfflineAlert />}
        <Errors errors={errors} doRemoveError={doRemoveError} />
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
              <span>{i18n.t('{{cookiecutter.project_name}}')}</span>
            </Link>
          }
          onRenderControls={this.controls}
          variant="object-home"
        />
      </>
    );
  }
}

const select = (appState: AppState) => ({
  user: selectUserState(appState),
  socket: selectSocketState(appState),
  errors: selectErrors(appState),
});

const actions = {
  doLogout: logout,
  doClearErrors: clearErrors,
  doRemoveError: removeError,
};

const WrappedHeader: React.ComponentType<{}> = connect(
  select,
  actions,
)(Header);

export default WrappedHeader;
