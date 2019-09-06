import React, { Suspense } from 'react';
import * as ReactDOM from 'react-dom';

import AuthProvider from './components/AuthProvider';
import Layout from './components/Layout';

ReactDOM.render(
  <Suspense fallback="Loading...">
    <AuthProvider>
      <Layout />
    </AuthProvider>
  </Suspense>,
  document.getElementById('app'),
);
