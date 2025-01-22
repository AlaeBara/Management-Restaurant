import React, { useEffect } from 'react';
import { useClientPreferences } from '../../../../../context/OrderFlowContext';
import { useTranslation } from 'react-i18next';
import Starter from './Starters/Starter';
import Entree from './Entrees/Entree';
import Dessert from './Desserts/Dessert';

const GuidMenu = ({ previousStep, nextStep, currentStep }) => {
  const { language } = useClientPreferences();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <>
      {currentStep === 1 && (
        <Starter 
          previousStep={previousStep} 
          nextStep={nextStep} 
        />
      )}
      {currentStep === 2 && (
        <Entree 
          previousStep={previousStep} 
          nextStep={nextStep} 
        />
      )}
      {currentStep === 3 && (
        <Dessert
          previousStep={previousStep} 
          nextStep={nextStep} 
        />
      )}
    </>
  );
};

export default GuidMenu;