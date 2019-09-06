import useFetch from 'fetch-suspense';
import qs from 'querystring';
import { useLocalStorage } from 'react-use';
import jwt from 'jsonwebtoken';
import React, { useEffect, Suspense, createContext, useContext, ReactNode } from 'react';

const AuthContext = createContext({
  token: null,
  logout: () => {},
  claims: {},
});
const useAuth = () => useContext(AuthContext);

const LogoutButton = () => {
  const { logout } = useAuth();
  return <button onClick={logout}>Log out</button>
}

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const response = useFetch('/api/auth/uri');
  // useEffect(() => {
  //   //window.location.href = response.uri;
  // });
  // return <span>Redirecting...</span>;
  const [token, setToken] = useLocalStorage('token');
  const logout = () => setToken(null);

  let claims = {};
  if (token) {
    claims = jwt.decode(token);
  }

  useEffect(() => {
    const params = qs.parse(window.location.hash);
    if (params.id_token) {
      setToken(params.id_token);
      window.location.hash = "";
    }
    else if (!claims.sub) {
      window.location = response.uri;
    }
  });

  return (
    <AuthContext.Provider value={{
      token,
      logout,
      claims,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const Child = () => {
  const { claims } = useAuth();
  return <span>{JSON.stringify(claims)}</span>;
}

export default AuthProvider;
export { useAuth };
