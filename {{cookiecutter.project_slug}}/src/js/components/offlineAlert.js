// @flow

import * as React from 'react';
import Alert from '@salesforce/design-system-react/components/alert';
import AlertContainer from '@salesforce/design-system-react/components/alert/container';
import i18n from 'i18next';

const reloadPage = (): void => {
  window.location.reload();
};

const OfflineAlert = () => (
  <AlertContainer className="offline-alert">
    <Alert
      labels={% raw %}{{
        heading: i18n.t(
          'You are in offline mode. We are trying to reconnect, but you may need to',
        ),
        headingLink: i18n.t('reload the page.'),
      }}{% endraw %}
      onClickHeadingLink={reloadPage}
      variant="offline"
    />
  </AlertContainer>
);

export default OfflineAlert;
