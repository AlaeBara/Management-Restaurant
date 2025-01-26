import React, { memo } from 'react';
import {  List, HelpCircle, ArrowLeft  } from 'lucide-react';
import style from './TypeMenu.module.css';
import { useClientPreferences } from '../../../../context/OrderFlowContext';
import { useTranslation } from 'react-i18next';

const TypeMenu = memo(({ previousStep, nextStep }) => {
  const { typemenu, settypemenu } = useClientPreferences();
  const { t } = useTranslation();

  const handleOptionSelect = (option) => {
    settypemenu(option); 
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>{t('select_menu_type')}</h1>

      <p className={style.sousTitle}>
        {t('Typemenu_description')}
      </p>

      <div className={style.ConnectBox}>
        <div
          className={`${style.box} ${typemenu === 'full_menu' ? style.selected : ''}`}
          onClick={() => handleOptionSelect('full_menu')}
        >
          < List className={style.icon} />
          <span className={style.langText}>
            {t('full_menu')}
          </span>
        </div>
        <div
          className={`${style.box} ${typemenu === 'guided_menu' ? style.selected : ''}`}
          onClick={() => handleOptionSelect('guided_menu')}
        >
          <HelpCircle className={style.icon} />
          <span className={style.langText}>
            {t('guided_menu')}
          </span>
        </div>
      </div>

      <div className={style.btnBox}>
        <button className={style.btn_back} onClick={previousStep}>
          <ArrowLeft /> {t('Previous')}
        </button>

        <button
          className={`${style.btn_next} ${typemenu ? style.btn_next_Active : style.btn_next_Disable}`}
          onClick={nextStep}
          disabled={!typemenu}
        >
          {t('Next')}
        </button>
      </div>
    </div>
  );
});

export default TypeMenu;
