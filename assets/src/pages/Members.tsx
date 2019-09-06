import React, { Fragment } from 'react';
import useFetch from 'fetch-suspense';
import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'

import { useAuth } from '../components/AuthProvider';
import { RouteComponentProps } from 'react-router';
import { Link, Route } from 'react-router-dom';

const MembersV = t.type({
  data: t.array(t.type({
    id: t.number,
    first_name: t.string,
    middle_name: t.string,
    last_name: t.string,
    email: t.string,
    memberships: t.array(t.type({
      valid: t.boolean,
      period: t.type({
        id: t.number,
        start: t.string,
        end: t.string,
      }),
    })),
  }))
});

const MembersList = ({ match }: RouteComponentProps) => {
  const { token } = useAuth();
  const response = useFetch('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const r = MembersV.decode(response);
  if (isLeft(r)) {
    throw new Error("Error");
  }
  const members = r.right.data;

  return (
    <>
      <div className="level">
        <h1 className="level-left">Members list</h1>
        <Link className="level-right button is-primary" to={`${match.path}add`}>
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
          <span>Add member</span>
        </Link>
      </div>
      <pre>
        <code>
          {JSON.stringify(members, null, 2)}
        </code>
      </pre>
    </>
  )
};


const AddMember = ({ match }: RouteComponentProps) => {
  const { token } = useAuth();
  const response = useFetch('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const r = MembersV.decode(response);
  if (isLeft(r)) {
    throw new Error("Error");
  }
  const members = r.right.data;

  return (
    <>
      <h1 className="level-left">Add member</h1>
      <form>
        <div className="field">
          <label className="label">First name</label>
          <div className="control">
            <input className="input" type="text" placeholder="First name..." />
          </div>
        </div>
        <div className="field">
          <label className="label">Middle name</label>
          <div className="control">
            <input className="input" type="text" placeholder="Middle name..." />
          </div>
        </div>
        <div className="field">
          <label className="label">Last name</label>
          <div className="control">
            <input className="input" type="text" placeholder="Last name..." />
          </div>
        </div>
        <div className="field">
          <label className="label">Email address</label>
          <div className="control">
            <input className="input" type="email" placeholder="Email address..." />
          </div>
        </div>
        <label className="checkbox">
          <input type="checkbox" />
          {' Subscribed?'}
        </label>
      </form>
    </>
  )
};

export default ({ match }: RouteComponentProps) => {
  return (
    <div className="content">
      <Route path={match.path} exact component={MembersList} />
      <Route path={`${match.path}add/`} component={AddMember} />
    </div>
  );
};
