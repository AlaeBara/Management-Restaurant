import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Home from './Pages/Qr-code/Home';

import OfflineNotification from './components/OfflineNotification';

const App = () => {
 
  return (
    <LanguageProvider>
      < OfflineNotification> 

        <Home />
        
      </OfflineNotification>
    </LanguageProvider>
  );
};

export default App;
