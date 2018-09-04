// @flow

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DocumentTitle from 'react-document-title';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import actionSprite from '@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg';
import customSprite from '@salesforce-ux/design-system/assets/icons/custom-sprite/svg/symbols.svg';
import doctypeSprite from '@salesforce-ux/design-system/assets/icons/doctype-sprite/svg/symbols.svg';
import standardSprite from '@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg';
import utilitySprite from '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';

import getApiFetch from 'utils/api';
import routes from 'utils/routes';
import userReducer from 'accounts/reducer';
import { cache, persistMiddleware } from 'utils/caching';
import { logError } from 'utils/logging';
import { login, doLocalLogout } from 'accounts/actions';

import Footer from 'components/footer';
import FourOhFour from 'components/404';
import Header from 'components/header';

const SF_logo = require('images/salesforce-logo.png');

const Home = () => (
  <div className="slds-text-longform">
    <h1 className="slds-text-heading_large">
      Welcome to {{cookiecutter.project_name}}!
    </h1>
    <p>This is sample intro text, where your content might live.</p>
  </div>
);

const App = () => (
  <DocumentTitle title="{{cookiecutter.project_name}}">
    <div
      className="slds-grid
        slds-grid_frame
        slds-grid_vertical"
    >
      <Header />
      <div
        className="slds-grow
          slds-shrink-none
          slds-p-horizontal_medium
          slds-p-vertical_large"
      >
        <Switch>
          <Route exact path={routes.home()} component={Home} />
          <Route component={FourOhFour} />
        </Switch>
      </div>
      <Footer logoSrc={SF_logo} />
    </div>
  </DocumentTitle>
);

cache
  .getAll()
  .then(data => {
    const el = document.getElementById('app');
    if (el) {
      // Create store
      const appStore = createStore(
        combineReducers({
          user: userReducer,
        }),
        data,
        composeWithDevTools(
          applyMiddleware(
            thunk.withExtraArgument({
              apiFetch: getApiFetch(() => {
                appStore.dispatch(doLocalLogout());
              }),
            }),
            persistMiddleware,
            logger,
          ),
        ),
      );

      // Get logged-in/out status
      const userString = el.getAttribute('data-user');
      if (userString) {
        let user;
        try {
          user = JSON.parse(userString);
        } catch (err) {
          // swallow error
        }
        if (user) {
          // Login
          appStore.dispatch(login(user));
        }
      }
      el.removeAttribute('data-user');

      ReactDOM.render(
        <Provider store={appStore}>
          <BrowserRouter>
            <IconSettings
              actionSprite={actionSprite}
              customSprite={customSprite}
              doctypeSprite={doctypeSprite}
              standardSprite={standardSprite}
              utilitySprite={utilitySprite}
            >
              <App />
            </IconSettings>
          </BrowserRouter>
        </Provider>,
        el,
      );
    }
  })
  .catch(err => {
    logError(err);
    throw err;
  });
