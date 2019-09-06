import React from 'react';
import useFetch from 'fetch-suspense';
import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'

import { useAuth } from '../components/AuthProvider';

const MembersV = t.type({
  data: t.array(t.type({
    id: t.number,
    first_name: t.string,
    middle_name: t.string,
    last_name: t.string,
    email: t.string,
    memberships: t.array(t.type({
      valid: t.boolean,
      period: t.type({
        id: t.number,
        start: t.string,
        end: t.string,
      }),
    })),
  }))
});

export default () => {
  const { token } = useAuth();
  const response = useFetch('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const r = MembersV.decode(response);
  if (isLeft(r)) {
    throw new Error("Error");
  }
  const members = r.right.data;
  return <div className="content">
    <h1>Members list</h1>
    <pre>
      <code>
        {JSON.stringify(members, null, 2)}
      </code>
    </pre>
  </div>;
};
