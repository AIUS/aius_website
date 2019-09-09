import React from 'react';
import useFetch from 'fetch-suspense';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, Link } from 'react-router-dom';
import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';

import { useAuth } from '../../components/AuthProvider';
import MembershipWidget from '../../components/MembershipWidget';
import { UserV } from '../../models/user';

const MembersV = t.type({
  data: t.array(UserV),
});

type Props = RouteComponentProps;

const MembersList: React.FunctionComponent<Props> = () => {
  const { t } = useTranslation('user');
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
          <th>{t('id')}</th>
          <th>{t('name')}</th>
          <th>{t('email')}</th>
          <th>{t('subscribed')}</th>
          <th>{t('birthdate')}</th>
          <th>{t('memberships')}</th>
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
