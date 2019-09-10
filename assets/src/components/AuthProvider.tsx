import useFetch from 'fetch-suspense';
import qs from 'querystring';
import { useLocalStorage } from 'react-use';
import jwt from 'jsonwebtoken';
import React, { createContext, useContext, ReactNode, Context } from 'react';
import * as t from 'io-ts';

const STORAGE_KEY = 'token';

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
  jwk: t.array(
    t.type({
      kid: t.string,
      pem: t.string,
    }),
  ),
});

interface AuthContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
}

interface AuthHook {
  token: string;
  claims: TokenClaims;
  logout: () => void;
  authenticatedFetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}

const AuthContext: Context<AuthContextValue> = createContext({
  token: null,
  setToken: _ => {},
});

interface AuthProviderProps {
  children?: ReactNode;
}

const useAuth = (): AuthHook => {
  const response = useFetch('/api/auth/uri');
  if (!AuthURIResponseV.is(response)) throw new Error('Invalid API response');
  const { uri, jwk } = response;

  const { token, setToken } = useContext(AuthContext);
  const logout = (): void => setToken('');

  const authenticatedFetch = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    return fetch(input, {
      ...(init || {}),
      headers: {
        ...((init && init.headers) || {}),
        Authorization: `Bearer ${token}`,
      },
    }).then(r => {
      if (r.status === 403) {
        logout();
        throw new Error('Forbidden');
      }

      return r;
    });
  };

  let claims: TokenClaims;
  if (token) {
    jwt.verify(
      token,
      (header, callback) => {
        const key = jwk.find(k => k.kid === header.kid);

        if (!key) callback('key not found');
        else callback(null, key.pem);
      },
      (err, data) => {
        if (err || !TokenClaimsV.is(data)) return logout();

        claims = data;
      },
    );
  }

  if (!claims || !claims.sub) {
    window.localStorage.removeItem(STORAGE_KEY);
    window.location.href = uri;
    throw new Promise((): void => {});
  }

  return { claims, token, logout, authenticatedFetch };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useAuthenticatedFetch = (input: RequestInfo, init?: RequestInit | undefined): Record<string, any> | string => {
  const { token, logout } = useAuth();
  const { status, response } = useFetch(
    input,
    {
      ...(init || {}),
      headers: {
        ...((init && init.headers) || {}),
        Authorization: `Bearer ${token}`,
      },
    },
    { metadata: true },
  );

  if (status === 403) {
    logout();
    throw new Error('Forbidden');
  }

  return response;
};

const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useLocalStorage(STORAGE_KEY, null, true);
  const params = qs.parse(window.location.hash.replace(/^#/, ''));
  if (params.id_token) {
    setToken(Array.isArray(params.id_token) ? params.id_token[0] : params.id_token);
    window.location.hash = '';
  } else if (params.error) {
    console.log(params);
    throw new Error();
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { useAuth, useAuthenticatedFetch };
