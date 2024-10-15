import React, { useState, useEffect } from 'react';
import Language from './Components/ChooseLanguage/Language';
import Connect from './Components/ChooseConnect/Connect';
import TypeMenu from './Components/ChooseTypeOfMenu/TypeMenu'
import { useClientPreferences } from '../../context/OrderFlowContext';
import { useTranslation } from 'react-i18next';
import FullMenu from './Components/Menu/FullMenu/FullMenu';
import GuidMenu from './Components/Menu/GuidMenu/GuidMenu';

const Home = () => {
  const [step, setStep] = useState(1);
  const { language, setLanguage } = useClientPreferences();
  const { typemenu, settypemenu } = useClientPreferences();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const nextStep = () => {
    setStep(step + 1);
  };
  const previousStep =()=>{
    setStep(step - 1);
  }
  
  return (
    <>
      {step === 1 && <Language nextStep={nextStep} />}

      {step === 2 && <Connect previousStep={previousStep} nextStep={nextStep} />}

      {step === 3 && <TypeMenu previousStep={previousStep} nextStep={nextStep} />}

      {step === 4 && (
        typemenu === 'full_menu' ? (
          <FullMenu />
        ) : (
          <GuidMenu />
        )
      )}
    </>
  );
};

export default Home;
