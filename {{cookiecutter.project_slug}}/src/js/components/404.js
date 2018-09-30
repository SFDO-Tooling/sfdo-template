// @flow

import * as React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';

import routes from 'utils/routes';

const FourOhFour = ({ children }: { children?: React.Node }) => (
  <DocumentTitle title="404 | {{cookiecutter.project_name}}">
    <div
      className="slds-text-longform
        slds-p-around_x-large"
    >
      <h1 className="slds-text-heading_large">Oh No!</h1>
      {children === undefined ? (
        <p>
          That page cannot be found. Try the{' '}
          <Link to={routes.home()}>home page</Link>?
        </p>
      ) : (
        children
      )}
    </div>
  </DocumentTitle>
);

export default FourOhFour;
