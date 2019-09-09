import React, { Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';
import AuthProvider from './components/AuthProvider';
import Layout from './components/Layout';

ReactDOM.render(
  <Suspense fallback="Loading...">
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </I18nextProvider>
  </Suspense>,
  document.getElementById('app'),
);
