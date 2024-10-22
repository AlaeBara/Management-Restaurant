import React, { useState, useEffect } from 'react';
import Language from './Components/ChooseLanguage/Language';
import Connect from './Components/ChooseConnect/Connect';
import TypeMenu from './Components/ChooseTypeOfMenu/TypeMenu';
import { useClientPreferences } from '../../context/OrderFlowContext';
import { useTranslation } from 'react-i18next';
import FullMenu from './Components/Menu/FullMenu/FullMenu';
import GuidMenu from './Components/Menu/GuidMenu/GuidMenu';
import Cart from './Components/Cart/Cart';

const Home = () => {
  const [mainStep, setMainStep] = useState(1);
  const [guidStep, setGuidStep] = useState(1);
  const { language, setLanguage } = useClientPreferences();
  const { typemenu, settypemenu } = useClientPreferences();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleMainNext = () => {
    setMainStep(prev => prev + 1);
  };

  const handleMainPrevious = () => {
    setMainStep(prev => prev - 1);
  };

  const handleGuidNext = () => {
    if (guidStep < 3) {
      setGuidStep(prev => prev + 1);
    } else {
      setMainStep(6);
    }
  };

  const handleGuidPrevious = () => {
    if (guidStep > 1) {
      setGuidStep(prev => prev - 1);
    } else {
      setMainStep(3);
    }
  };

  const handleCartPrevious = () => {
    if (typemenu === 'full_menu') {
      setMainStep(4);
    } else {
      setMainStep(4);
      setGuidStep(3);
    }
  };

  const handelFullMenuNext = () => {
    setMainStep(6);
  };

  return (
    <>
      {mainStep === 1 && (
        <Language nextStep={handleMainNext} />
      )}

      {mainStep === 2 && (
        <Connect 
          previousStep={handleMainPrevious} 
          nextStep={handleMainNext} 
        />
      )}

      {mainStep === 3 && (
        <TypeMenu 
          previousStep={handleMainPrevious} 
          nextStep={handleMainNext} 
        />
      )}

      {mainStep === 4 && typemenu === 'full_menu' && (
        <FullMenu 
          previousStep={handleMainPrevious} 
          nextStep={handelFullMenuNext}
        />
      )}

      {mainStep === 4 && typemenu !== 'full_menu' && (
        <GuidMenu
          currentStep={guidStep}
          previousStep={handleGuidPrevious}
          nextStep={handleGuidNext}
        />
      )}

      {mainStep === 6 && (
        <Cart 
          previousStep={handleCartPrevious}
          nextStep={handleMainNext}
        />
      )}
    </>
  );
};

export default Home;