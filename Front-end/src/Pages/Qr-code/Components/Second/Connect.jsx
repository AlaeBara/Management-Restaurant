import React, { useState } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import style from './Connect.module.css';
import { useTranslation } from 'react-i18next';

const Connect = ({previousStep , nextStep}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { t } = useTranslation();

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleProvuious = () => {
    previousStep()
  };

  const handleNext = () => {
    nextStep()
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>{t('choose_option')}</h1>
      <div className={style.ConnectBox}>
        <div
          className={`${style.box} ${selectedOption === 'create' ? style.selected : ''}`}
          onClick={() => handleOptionChange('create')}
        >
          <UserPlus className={style.icon} />
          <span className={style.langText}>{t('create_account')}</span> 
        </div>
        <div
          className={`${style.box} ${selectedOption === 'guest' ? style.selected : ''}`}
          onClick={() => handleOptionChange('guest')}
        >
          <UserMinus className={style.icon} />
          <span className={style.langText}>{t('continue_as_guest')}</span>
        </div>
      </div>
      <div className={style.btnBox}>
        <button  className={style.btn_next} onClick={handleProvuious}>{t('Provious')}</button>
        <button  className={style.btn_next} onClick={handleNext}>{t('Next')}</button>
      </div>
    </div>
  );
};

export default Connect;
