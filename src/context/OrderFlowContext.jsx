import React, { createContext, useContext, useState } from 'react';

// Renamed to OrderFlowContext
const OrderFlowContext = createContext();

export const ClientPreferencesProvider = ({ children }) => {
  const [language, setLanguage] = useState(''); // Default language state
  const [connect, setconnect] = useState(null); // Stores type of connect
  const [typemenu, settypemenu] = useState(null); //  Stores type of menu

  return (
    <OrderFlowContext.Provider value={{ language, setLanguage, connect, setconnect,typemenu,settypemenu  }}>
      {children}
    </OrderFlowContext.Provider>
  );
};

// Renamed custom hook to useClientPreferences
export const useClientPreferences = () => {
  return useContext(OrderFlowContext);
};
