import React, { useState, useEffect } from 'react';
import style from './Home.module.css';
import Language from './Components/First/Language';
import Connect from './Components/Second/Connect';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [step, setStep] = useState(1);
  const { language, setLanguage } = useLanguage();
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
      {step === 2 && <Connect previousStep={previousStep} />}
    </>
  );
};

export default Home;
