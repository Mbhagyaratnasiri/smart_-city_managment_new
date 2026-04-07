import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try{
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  });

  useEffect(()=>{
    if(user) localStorage.setItem('auth', JSON.stringify(user));
    else localStorage.removeItem('auth');
  }, [user]);

  function login(data){
    setUser(data);
  }
  function logout(){
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  return useContext(AuthContext);
}
