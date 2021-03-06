import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation('ui');
  const [language, setLanguage] = useState(i18n.language.split('-')[0]);

  if (language !== i18n.language) {
    throw new Promise((resolve): void => {
      i18n.changeLanguage(language, () => {
        resolve();
      });
    });
  }

  return (
    <div className="buttons has-addons">
      <button
        className={language === 'en' ? 'button is-small is-selected is-dark' : 'button is-small'}
        onClick={(): void => setLanguage('en')}
      >
        {t('en')}
      </button>
      <button
        className={language === 'fr' ? 'button is-small is-selected is-dark' : 'button is-small'}
        onClick={(): void => setLanguage('fr')}
      >
        {t('fr')}
      </button>
      <button
        className={language === 'gsw' ? 'button is-small is-selected is-dark' : 'button is-small'}
        onClick={(): void => setLanguage('gsw')}
      >
        {t('gsw')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
