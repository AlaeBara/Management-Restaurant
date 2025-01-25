import React from 'react';
import { UserPlus, UserMinus , ArrowLeft } from 'lucide-react';
import style from './Connect.module.css';
import { useClientPreferences } from '../../../../context/OrderFlowContext';
import { useTranslation } from 'react-i18next';

const Connect = ({ previousStep, nextStep }) => {
  const { connect, setconnect } = useClientPreferences();
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      <h1 className={style.title}>{t('choose_option')}</h1>
      <p className={style.sousTitle}>
        {t('connect_description')} 
      </p>

      <div className={style.ConnectBox}>
        <div
          className={`${style.box} ${connect === 'create' ? style.selected : ''}`}
          onClick={() => setconnect('create')}
        >
          <UserPlus className={style.icon} />
          <span className={style.langText}>{t('create_account')}</span>
        </div>
        <div
          className={`${style.box} ${connect === 'guest' ? style.selected : ''}`}
          onClick={() => setconnect('guest')}
        >
          <UserMinus className={style.icon} />
          <span className={style.langText}>{t('continue_as_guest')}</span>
        </div>
      </div>

      <div className={style.btnBox}>
        <button className={style.btn_back} onClick={previousStep}>
          <ArrowLeft /> {t('Previous')}
        </button>

        <button
          className={`${style.btn_next} ${connect ? style.btn_next_Active : style.btn_next_Disable}`}
          onClick={nextStep}
          disabled={!connect}
        >
          {t('Next')}
        </button>
      </div>
    </div>
  );
};

export default Connect;
