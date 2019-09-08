import React from 'react';
import useFetch from 'fetch-suspense';
import { RouteComponentProps, Link } from 'react-router-dom';
import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';

import { useAuth } from '../../components/AuthProvider';
import MembershipWidget from '../../components/MembershipWidget';

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
      subscribed: t.boolean,
      birthdate: t.union([t.string, t.nullType]),
      memberships: t.array(
        t.type({
          id: t.number,
          valid: t.boolean,
          situation: t.string,
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
    throw new Error(PathReporter.report(r).join(','));
  }
  const members = r.right.data;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Subscribed</th>
          <th>Birth date</th>
          <th>Memberships</th>
        </tr>
      </thead>
      <tbody>
        {members.map(({ id, first_name, middle_name, last_name, email, birthdate, memberships, subscribed }) => (
          <tr key={id}>
            <td>
              <Link to={`/members/${id}/`}>{id}</Link>
            </td>
            <td>
              {first_name} <i>{middle_name}</i> <span className="has-text-weight-medium">{last_name}</span>
            </td>
            <td>
              <a href={`mailto:${email}`}>{email}</a>
            </td>
            <td>
              <FontAwesomeIcon icon={subscribed ? faCheckCircle : faTimesCircle} />
            </td>
            <td>{birthdate}</td>
            <td>
              {memberships.map(membership => (
                <div key={membership.id}>
                  <MembershipWidget membership={membership} userId={id} />
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MembersList;
