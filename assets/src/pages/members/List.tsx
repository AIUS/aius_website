import React from 'react';
import useFetch from 'fetch-suspense';
import { RouteComponentProps } from 'react-router-dom';
import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either';

import { useAuth } from '../../components/AuthProvider';

const MembersV = t.type({
  data: t.array(
    t.type({
      id: t.number,
      /* eslint-disable @typescript-eslint/camelcase */
      first_name: t.string,
      middle_name: t.string,
      last_name: t.string,
      /* eslint-enable @typescript-eslint/camelcase */
      email: t.string,
      memberships: t.array(
        t.type({
          valid: t.boolean,
          period: t.type({
            id: t.number,
            start: t.string,
            end: t.string,
          }),
        }),
      ),
    }),
  ),
});

type Props = RouteComponentProps;

const MembersList: React.FunctionComponent<Props> = () => {
  const { token } = useAuth();
  const response = useFetch('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const r = MembersV.decode(response);
  if (isLeft(r)) {
    throw new Error('Error');
  }
  const members = r.right.data;

  return (
    <>
      <pre>
        <code>{JSON.stringify(members, null, 2)}</code>
      </pre>
    </>
  );
};

export default MembersList;
