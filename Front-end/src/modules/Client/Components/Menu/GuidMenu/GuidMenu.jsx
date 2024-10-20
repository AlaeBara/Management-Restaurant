import React, { useState, useEffect } from 'react';
import { useClientPreferences } from '../../../../../context/OrderFlowContext';
import { useTranslation } from 'react-i18next';
import Starter from './Starters/Starter';
import Entree from './Entrees/Entree';
import Dessert from './Desserts/Dessert'

const GuidMenu = ({ previousStep, nextStep }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { language } = useClientPreferences();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      previousStep();
    }
  };

  return (
    <>
      {currentStep === 1 && (
        <Starter 
          previousStep={handlePrevious} 
          nextStep={handleNext} 
        />
      )}
      {currentStep === 2 && (
        <Entree 
          previousStep={handlePrevious} 
          nextStep={handleNext} 
        />
      )}
      {currentStep === 3 && (
        <Dessert
          previousStep={handlePrevious} 
          nextStep={handleNext} 
        />
      )}
    </>
  );
};

export default GuidMenu;