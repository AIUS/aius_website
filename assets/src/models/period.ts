import * as t from 'io-ts';

const PeriodV = t.type({
  id: t.number,
  start: t.string,
  end: t.string,
}, 'Period');

interface Period {
  id: number;
  start: string;
  end: string;
};

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


export default Period;
export { Period, PeriodV, formatPeriod };
