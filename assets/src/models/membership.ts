import * as t from 'io-ts';

import Period, { PeriodV } from './period';

const MembershipV = t.type({
  id: t.number,
  valid: t.boolean,
  situation: t.string,
  period: PeriodV,
}, 'Membership');

interface Membership {
  id: number;
  valid: boolean;
  situation: string;
  period: Period;
};

export default Membership;
export { Membership, MembershipV };
