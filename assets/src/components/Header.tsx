import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import { useAuth } from './AuthProvider';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FunctionComponent = () => {
  const { t } = useTranslation('ui');
  const { claims, logout } = useAuth();
  const name = claims.name;

  return (
    <nav className="navbar is-primary" role="navigation">
      <div className="container">
        <div className="navbar-brand">
          <NavLink activeClassName="is-active" to="/" exact className="navbar-item">
            {t('aius')}
          </NavLink>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <div className="navbar-item has-dropdown is-hoverable">
              <NavLink activeClassName="is-active" to="/members/" className="navbar-link">
                {t('members')}
              </NavLink>

              <div className="navbar-dropdown">
                <Link to="/members/add/" className="navbar-item">
                  {t('add_member')}
                </Link>
              </div>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <LanguageSwitcher />
            </div>
            <div className="navbar-item">
              <div>
                <Trans i18nKey="ui:greeting">
                  Hello <i>{{ name }}</i>.
                </Trans>
              </div>
            </div>
            <div className="navbar-item">
              <button className="button is-white" onClick={logout}>
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
