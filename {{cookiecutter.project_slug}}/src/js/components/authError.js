// @flow

import * as React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';

import routes from 'utils/routes';

const AuthError = () => (
  <DocumentTitle title="Login Error | {{cookiecutter.project_name}}">
    <div
      className="slds-text-longform
        slds-p-around_x-large"
    >
      <h1 className="slds-text-heading_large">Oh No!</h1>
      <p>
        An error occurred while attempting to log in. Try the{' '}
        <Link to={routes.home()}>home page</Link>?
      </p>
    </div>
  </DocumentTitle>
);

export default AuthError;
