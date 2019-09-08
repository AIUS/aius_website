import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import { useAuth } from './AuthProvider';

const Header: React.FunctionComponent = () => {
  const { claims, logout } = useAuth();

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
            <div className="navbar-item has-dropdown is-hoverable">
              <NavLink activeClassName="is-active" to="/members/" className="navbar-link">
                Members
              </NavLink>

              <div className="navbar-dropdown">
                <Link to="/members/add/" className="navbar-item">
                  Add
                </Link>
              </div>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div>
                Hello <em>{claims.name}</em>.
              </div>
            </div>
            <div className="navbar-item">
              <button className="button is-white" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
