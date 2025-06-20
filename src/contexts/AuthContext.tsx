import React, { createContext, useContext } from 'react';

interface AuthContextType {
  // Placeholder - not used anymore
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  // Return empty object since we're using localStorage now
  return {};
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};
