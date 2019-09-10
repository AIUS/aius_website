import useFetch from 'fetch-suspense';
import qs from 'querystring';
import { useLocalStorage } from 'react-use';
import jwt from 'jsonwebtoken';
import React, { createContext, useContext, ReactNode, Context } from 'react';
import * as t from 'io-ts';
import { fold, isLeft } from 'fp-ts/lib/Either';

const TokenClaimsV = t.type({
  sub: t.string,
  name: t.string,
  email: t.string,
});

interface TokenClaims {
  sub: string;
  name: string;
  email: string;
}

const AuthURIResponseV = t.type({
  uri: t.string,
  jwk: t.array(t.type({
    kid: t.string,
    pem: t.string,
  })),
});

interface AuthContextValue {
  token: string | null;
  logout: () => void;
  claims: TokenClaims | null;
}

const AuthContext: Context<AuthContextValue> = createContext({
  token: null,
  logout: () => {},
  claims: null,
});
const useAuth = (): AuthContextValue => useContext(AuthContext);

interface AuthProviderProps {
  children?: ReactNode;
}

const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({ children }: AuthProviderProps) => {
  const response = useFetch('/api/auth/uri');
  const [token, setToken] = useLocalStorage('token', null, true);
  const logout = (): void => setToken(null);
  const d = AuthURIResponseV.decode(response);
  if (isLeft(d)) throw new Error("Invalid API response");
  const { uri, jwk } = d.right;

  let claims: TokenClaims | null = null;
  if (token) {
    let c;
    jwt.verify(token, (header, callback) => {
      const key = jwk.find(k => k.kid === header.kid);
      callback(null, key.pem);
    }, (err, data) => {
      if (err) {
        logout();
        throw new Promise(() => {});
      }
      c = data;
    });
    const d = TokenClaimsV.decode(c);
    claims = fold(() => null, (t: TokenClaims) => t)(d);
  }

  const params = qs.parse(window.location.hash.replace(/^#/, ''));
  if (params.id_token) {
    setToken(params.id_token);
    window.location.hash = '';
  } else if (params.error) {
    console.log(params);
    throw new Error();
  } else if (!claims || !claims.sub) {
    window.location.href = uri;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        logout,
        claims,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { useAuth };
