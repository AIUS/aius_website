import React from 'react';
import { NavLink } from 'react-router-dom';

import { useAuth } from './AuthProvider';

export default () => {
  const { claims } = useAuth();

  return (
    <nav className="navbar is-primary" role="navigation">
      <div className="container">
        <div className="navbar-brand">
          <NavLink activeClassName="is-active" to="/" exact className="navbar-item">
            AIUS
          </NavLink>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <NavLink activeClassName="is-active" to="/members/" className="navbar-item">
              Members
            </NavLink>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div>
                Hello <em>{claims.name}</em>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
