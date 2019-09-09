/* eslint-disable @typescript-eslint/camelcase */
import * as t from 'io-ts';

import Membership, { MembershipV } from './Membership';

const UserV = t.type({
  id: t.number,
  first_name: t.string,
  middle_name: t.string,
  last_name: t.string,
  email: t.string,
  subscribed: t.boolean,
  birthdate: t.string,
  memberships: t.array(MembershipV),
}, 'User');

interface User {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  subscribed: boolean;
  birthdate: string;
  memberships: Membership[];
};

export default User;
export { User, UserV };
