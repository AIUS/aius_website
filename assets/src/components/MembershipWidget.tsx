import React, { useState } from 'react';

import { useAuth } from './AuthProvider';
import { Membership } from '../models/membership';
import { Period, formatPeriod } from '../models/period';

interface Props {
  membership: Membership;
  userId: number;
}

const MembershipWidget: React.FunctionComponent<Props> = ({ membership, userId }: Props) => {
  const period = formatPeriod(membership.period);
  const [valid, setValid] = useState(membership.valid);
  const [updating, setUpdating] = useState(false);
  const { token } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (updating) return;

    fetch(`/api/users/${userId}/memberships/${membership.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        membership: {
          valid: e.target.checked,
        },
      }),
      headers: {
        Authorization: `Bearer ${token}`,
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
