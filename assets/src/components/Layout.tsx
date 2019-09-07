import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

import Header from './Header';

import Home from '../pages/Home';
import Members from '../pages/Members';

interface BCRProps {
  path: string;
  exact?: boolean;
  label: string;
  children?: ReactNode;
}

const BreadcrumbRoute: React.FunctionComponent<BCRProps> = ({ path, exact = false, label, children }: BCRProps) => (
  <Route
    path={path}
    exact={exact}
    render={({ match, location }): ReactNode => (
      <>
        <li className={location.pathname === match.path ? 'is-active' : ''}>
          <Link to={match.path}>{label}</Link>
        </li>
        {children}
      </>
    )}
  />
);

const Layout: React.FunctionComponent = () => (
  <Router>
    <Header />

    <main className="section">
      <nav className="breadcrumb" aria-label="breadcrumb">
        <ul>
          <li>
            <Link to="/">AIUS</Link>
          </li>
          <BreadcrumbRoute path="/" exact label="Home" />
          <BreadcrumbRoute path="/members/" label="Members">
            <BreadcrumbRoute path="/members/add/" label="Add" />
          </BreadcrumbRoute>
        </ul>
      </nav>

      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/members/" component={Members} />
      </Switch>
    </main>
  </Router>
);

export default Layout;
