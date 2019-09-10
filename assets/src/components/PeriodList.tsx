import React from 'react';
import * as t from 'io-ts';

import { useAuthenticatedFetch } from './AuthProvider';
import { Period, PeriodV, formatPeriod } from '../models/period';

const PeriodsV = t.type({
  data: t.array(PeriodV),
});

interface Props {
  selected: number;
  onChange(id: number): void;
}

const PeriodList: React.FunctionComponent<Props> = ({ selected, onChange }: Props) => {
  const response = useAuthenticatedFetch('/api/periods');
  if (!PeriodsV.is(response)) {
    throw new Error('Invalid API response');
  }

  const periods = response.data;

  if (periods.length === 1) {
    if (selected !== periods[0].id) {
      onChange(periods[0].id);
    }

    return null;
  }

  return (
    <div className="buttons has-addons">
      {periods.map((period: Period) => (
        <button
          key={period.id}
          className={period.id === selected ? 'button is-selected is-success' : 'button'}
          onClick={(): void => onChange(period.id)}
        >
          {formatPeriod(period)}
        </button>
      ))}
    </div>
  );
};

export default PeriodList;
