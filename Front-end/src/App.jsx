import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Home from './Pages/Qr-code/Home';

const App = () => {
  return (
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  );
};

export default App;
