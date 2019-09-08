import React, { useState } from 'react';

import { useAuth } from './AuthProvider';

interface Period {
  start: string;
  end: string;
}

interface Membership {
  id: number;
  period: Period;
  valid: boolean;
}

interface Props {
  membership: Membership;
  userId: number;
}

const formatPeriod = (period: Period): string => {
  const [y1, m1, d1] = period.start.split('-');
  const [y2, m2, d2] = period.end.split('-');
  if (y1 !== y2) {
    return `${y1}-${y2}`;
  }

  if (m1 !== m2) {
    return `${m1}/${y1}-${m2}/${y2}`;
  }

  if (d1 !== d2) {
    return `${d1}/${m1}/${y1}-${d2}/${m2}/${y2}`;
  }

  return `${d1}/${m1}/${y1}`;
};

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
      {period} | <input type="checkbox" disabled={updating} checked={valid} onChange={handleChange} /> Valid
    </>
  );
};

export default MembershipWidget;
