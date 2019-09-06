import React from 'react';

import Form from './Form';
import { useAuth } from './AuthProvider';
import 'bulma/css/bulma.min.css';

export const Hello = () => {
  const { claims, logout } = useAuth();
  return (
    <div>
      <h1>Hello!</h1>
      <div>{JSON.stringify(claims)}</div>
      <button onClick={logout}>Logout</button>
      <Form />
    </div>
  )
};

export default Hello;
