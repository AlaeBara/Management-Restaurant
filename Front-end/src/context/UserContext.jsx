import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data based on the token
  const fetchUserData = async () => {
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/authentication/validate-token`,
          {}, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
        console.log(response.data)
      } catch (error) {
        setUser(null); // Clear user if there was an error
      }
    }
    setLoading(false);
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Logout function
   const logout = () => {
    Cookies.remove("access_token");
    setUser(null);
    //window.location.reload(); // Force reload to reset app state
  };;

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUserData , logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
