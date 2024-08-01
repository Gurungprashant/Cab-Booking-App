import React, { createContext, useState } from 'react';

export const CabContext = createContext();

export const CabProvider = ({ children }) => {
  const [bookedCabs, setBookedCabs] = useState([]);
  const [availableCabs, setAvailableCabs] = useState([]);

  return (
    <CabContext.Provider value={{ bookedCabs, setBookedCabs, availableCabs, setAvailableCabs }}>
      {children}
    </CabContext.Provider>
  );
};
