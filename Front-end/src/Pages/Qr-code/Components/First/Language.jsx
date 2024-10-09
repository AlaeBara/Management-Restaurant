import React, { useState } from 'react';
import { Flag, Globe, Languages } from 'lucide-react';
import style from './language.module.css';
import { useLanguage } from '../../../../Context/LanguageContext';

const LanguageSelector = ({ nextStep }) => {
  const { setLanguage } = useLanguage(); 
  const [selectedLanguage, setSelectedLanguage] = useState(null); 

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
  };

  const handleNext = () => {
    setLanguage(selectedLanguage);
    nextStep();
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>Choisir Votre Langue</h1>
      <div className={style.languageBox}>
        <div
          className={`${style.box} ${selectedLanguage === 'fr' ? style.selected : ''}`}
          onClick={() => handleLanguageChange('fr')}
        >
          <Flag className={style.icon} />
          <span className={style.langText}>Français</span>
        </div>
        <div
          className={`${style.box} ${selectedLanguage === 'en' ? style.selected : ''}`}
          onClick={() => handleLanguageChange('en')}
        >
          <Globe className={style.icon} />
          <span className={style.langText}>English</span>
        </div>
        <div
          className={`${style.box} ${selectedLanguage === 'ar' ? style.selected : ''}`}
          onClick={() => handleLanguageChange('ar')}
        >
          <Languages className={style.icon} />
          <span className={style.langText}>العربية</span>
        </div>
      </div>

      <button onClick={handleNext} className={`${style.btn_next} ${selectedLanguage ? style.btn_next_Active : style.btn_next_Disable }`} disabled={!selectedLanguage} >Next</button>
    </div>
  );
}; 

export default LanguageSelector;
