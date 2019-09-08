import React from 'react';
import useFetch from 'fetch-suspense';
import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either';

import { useAuth } from './AuthProvider';

const PeriodsV = t.type({
  data: t.array(
    t.type({
      id: t.number,
      start: t.string,
      end: t.string,
    }),
  ),
});

interface Period {
  id: number;
  start: string;
  end: string;
}

interface Props {
  selected: number;
  onChange(id: number): void;
}

const PeriodList: React.FunctionComponent<Props> = ({ selected, onChange }: Props) => {
  const { token } = useAuth();
  const r = PeriodsV.decode(
    useFetch('/api/periods', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  if (isLeft(r)) {
    throw new Error('Invalid API response');
  }

  const periods = r.right.data;

  if (periods.length < 2) {
    if (selected !== periods[0].id) {
      onChange(periods[0].id);
    }

    return null;
  }

  return (
    <div className="buttons has-addons">
      {periods.map(({ id, start, end }: Period) => (
        <button
          key={id}
          className={id === selected ? 'button is-selected is-success' : 'button'}
          onClick={(): void => onChange(id)}
        >
          {start} / {end}
        </button>
      ))}
    </div>
  );
};

export default PeriodList;
