import React, { useState } from 'react';

import { useAuth } from './AuthProvider';
import { Membership } from '../models/membership';
import { formatPeriod } from '../models/period';

interface Props {
  membership: Membership;
  userId: number;
}

const MembershipWidget: React.FunctionComponent<Props> = ({ membership, userId }: Props) => {
  const period = formatPeriod(membership.period);
  const [valid, setValid] = useState(membership.valid);
  const [updating, setUpdating] = useState(false);
  const { authenticatedFetch } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (updating) return;

    authenticatedFetch(`/api/users/${userId}/memberships/${membership.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        membership: {
          valid: e.target.checked,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(r => r.json())
      .then(r => {
        if (!r.data) throw new Error('Invalid API response');
        setUpdating(false);
        // @TODO: typecheck response
        setValid(r.data.valid);
      });
    setUpdating(true);
  };

  return (
    <>
      {period} | <input type="checkbox" disabled={updating} checked={valid} onChange={handleChange} /> Valid |{' '}
      {membership.situation}
    </>
  );
};

export default MembershipWidget;
