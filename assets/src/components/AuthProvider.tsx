import useFetch from 'fetch-suspense';
import qs from 'querystring';
import { useLocalStorage } from 'react-use';
import jwt from 'jsonwebtoken';
import React, { useEffect, Suspense, createContext, useContext, ReactNode, Context } from 'react';

interface TokenClaims {
  sub: string,
  name: string,
  email: string,
};

interface AuthContextValue {
  token: string | null,
  logout: () => void,
  claims: TokenClaims | null,
};

const AuthContext: Context<AuthContextValue> = createContext({
  token: null,
  logout: () => {},
  claims: null,
});
const useAuth = () => useContext(AuthContext);

const validateClaims = (claims: any): null | TokenClaims => {
  if (claims
    && claims.sub
    && claims.name
    && claims.email) {
    return {
      sub: claims.sub,
      name: claims.name,
      email: claims.email,
    };
  }
  return null;
}

const extractURI = (response: any): string => {
  if (response.uri) {
    return response.uri;
  }
  throw new Error("Invalid response from API");
}


const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const response = useFetch('/api/auth/uri');
  const [token, setToken] = useLocalStorage('token', null, true);
  const logout = () => setToken(null);

  let claims: TokenClaims | null = null;
  if (token) {
    claims = validateClaims(jwt.decode(token));
  }

  const params = qs.parse(window.location.hash.replace(/^#/, ''));
  if (params.id_token) {
    setToken(params.id_token);
    window.location.hash = "";
  }
  else if (params.error) {
    console.log(params);
    throw new Error();
  }
  else if (!claims || !claims.sub) {
    window.location.href = extractURI(response);
  }

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

export default AuthProvider;
export { useAuth };
