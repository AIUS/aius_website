import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

import Header from './Header';

import Home from '../pages/Home';
import Members from '../pages/Members';

export default () => (
  <Router>
    <Header />

    <main className="section">
      <Route path="/" exact component={Home} />
      <Route path="/members/" component={Members} />
    </main>
  </Router>
);
