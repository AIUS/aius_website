import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useAuthenticatedFetch } from '../../components/AuthProvider';

type Props = RouteComponentProps<{
  userId: string;
}>;

const ViewMember: React.FunctionComponent<Props> = ({
  match: {
    params: { userId },
  },
}: Props) => {
  const r = useAuthenticatedFetch(`/api/users/${userId}`);
  return (
    <pre>
      <code>{JSON.stringify(r, null, 2)}</code>
    </pre>
  );
};

export default ViewMember;
