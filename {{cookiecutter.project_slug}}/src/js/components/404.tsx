import Illustration from '@salesforce/design-system-react/components/illustration';
import i18n from 'i18next';
import React, { ReactNode } from 'react';
import DocumentTitle from 'react-document-title';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import routes from '@/utils/routes';
import svgPath from '#/desert.svg';

export const EmptyIllustration = ({ message }: { message: ReactNode }) => (
  <Illustration
    heading="¯\_(ツ)_/¯"
    messageBody={message}
    name="Desert"
    path={`${svgPath}#desert`}
    size="large"
  />
);

const FourOhFour = ({ message }: { message?: ReactNode }) => (
  <DocumentTitle title={`${i18n.t('404')} | ${i18n.t('{{cookiecutter.project_name}}')}`}>
    <EmptyIllustration
      message={
        message === undefined ? (
          <Trans i18nKey="pageCannotBeFound">
            That page cannot be found. Try the{' '}
            <Link to={routes.home()}>home page</Link>?
          </Trans>
        ) : (
          message
        )
      }
    />
  </DocumentTitle>
);

export default FourOhFour;
