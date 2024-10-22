import React, { useState } from 'react';
import styles from './Cart.module.css';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, ShoppingCart ,ArrowLeft} from 'lucide-react'; 

const Cart = ({ previousStep, nextStep }) => {
  const { t, i18n } = useTranslation();

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return ( 
    <>
      <div className={styles.container} dir={dir}>

        <h1 className={styles.title}>Cart</h1>

      </div>

      {/* Fixed Navigation Buttons */}
      <div className={styles.btnBox}>
        <button className={styles.btn_back} onClick={previousStep}>
          <ArrowLeft /> {t('Previous')}
        </button>

        {/* <button
          className={`${styles.btn_next}`}
          onClick={nextStep}
        >
          {t('Next')}
        </button> */}
      </div>
    </>
  );
};

export default Cart;
