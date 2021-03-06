import i18n from 'i18next';
import React from 'react';

const Footer = (props: { logoSrc: string }) => (
  <footer
    className="slds-grid
      slds-grid--align-spread
      slds-grid_vertical-align-center
      slds-wrap
      slds-p-horizontal_x-large
      slds-p-vertical_medium
      slds-text-body_small
      site-contentinfo"
  >
    <div
      className="footer-logo footer-item slds-m-right_medium slds-grow"
      style={% raw %}{{ backgroundImage: `url(${props.logoSrc})` }}{% endraw %}
      data-testid="footer-logo"
    />
    <div className="footer-item slds-grid">
      <p>{i18n.t('Copyright {% now 'utc', '%Y' %} {{cookiecutter.author_name}}. All rights reserved.')}</p>
    </div>
  </footer>
);

export default Footer;
