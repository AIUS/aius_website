import React from 'react';
import useFetch from 'fetch-suspense';
import { RouteComponentProps } from 'react-router-dom';
import { useAuth } from '../../components/AuthProvider';

type Props = RouteComponentProps<{
  userId: string;
}>;

const ViewMember: React.FunctionComponent<Props> = ({
  match: {
    params: { userId },
  },
}: Props) => {
  const { token } = useAuth();
  const r = useFetch(`/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return (
    <pre>
      <code>{JSON.stringify(r, null, 2)}</code>
    </pre>
  );
};

export default ViewMember;
