// @flow

import * as React from 'react';
import DocumentTitle from 'react-document-title';
import Illustration from '@salesforce/design-system-react/components/illustration';
import { Link } from 'react-router-dom';

import routes from 'utils/routes';

import svgPath from 'images/desert.svg';

export const EmptyIllustration = ({ message }: { message: React.Node }) => (
  <Illustration
    heading="¯\_(ツ)_/¯"
    messageBody={message}
    name="Desert"
    path={`${svgPath}#desert`}
    size="large"
  />
);

const FourOhFour = ({ message }: { message?: React.Node }) => (
  <DocumentTitle title="404 | {{cookiecutter.project_name}}">
    <EmptyIllustration
      message={
        message === undefined ? (
          <>
            That page cannot be found. Try the{' '}
            <Link to={routes.home()}>home page</Link>?
          </>
        ) : (
          message
        )
      }
    />
  </DocumentTitle>
);

export default FourOhFour;
