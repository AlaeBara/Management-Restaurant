import React from 'react';
import { Flag, Globe, Languages } from 'lucide-react';
import style from './language.module.css';
import { useClientPreferences } from '../../../../context/OrderFlowContext';

const LanguageSelector = ({ nextStep }) => {
  const { language, setLanguage } = useClientPreferences(); // Access the Option of Client

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>Choisir Votre Langue</h1>
      <div className={style.languageBox}>
        <div
          className={`${style.box} ${language === 'fr' ? style.selected : ''}`}
          onClick={() => handleLanguageChange('fr')}
        >
          <Flag className={style.icon} />
          <span className={style.langText}>Français</span>
        </div>
        <div
          className={`${style.box} ${language === 'en' ? style.selected : ''}`}
          onClick={() => handleLanguageChange('en')}
        >
          <Globe className={style.icon} />
          <span className={style.langText}>English</span>
        </div>
        <div
          className={`${style.box} ${language === 'ar' ? style.selected : ''}`}
          onClick={() => handleLanguageChange('ar')}
        >
          <Languages className={style.icon} />
          <span className={style.langText}>العربية</span>
        </div>
      </div>

      <button
        onClick={nextStep}
        className={`${style.btn_next} ${language ? style.btn_next_Active : style.btn_next_Disable}`}
        disabled={!language}
      >
        Next
      </button>
    </div>
  );
};

export default LanguageSelector;
