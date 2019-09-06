import React, { Fragment } from 'react';
import useFetch from 'fetch-suspense';
import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either';

import { useAuth } from '../components/AuthProvider';
import { RouteComponentProps } from 'react-router';
import { Link, Route } from 'react-router-dom';
import { useForm, useField } from 'react-final-form-hooks';

const MembersV = t.type({
  data: t.array(
    t.type({
      id: t.number,
      first_name: t.string,
      middle_name: t.string,
      last_name: t.string,
      email: t.string,
      memberships: t.array(
        t.type({
          valid: t.boolean,
          period: t.type({
            id: t.number,
            start: t.string,
            end: t.string,
          }),
        }),
      ),
    }),
  ),
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
    throw new Error('Error');
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
        <code>{JSON.stringify(members, null, 2)}</code>
      </pre>
    </>
  );
};

const onSubmit = () => {

};

interface FormValues {
  firstName?: string,
  middleName?: string,
  lastName?: string,
  email?: string,
  subscribed?: boolean,
};

const validateForm = (values: FormValues) => {
  const errors: FormValues = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  }
  if (!values.lastName) {
    errors.lastName = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!values.email.match(/.+@.+/)) {
    errors.email = 'Please enter a valid email address';
  }
  return errors;
};

const AddMember = () => {
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit,
    validate: validateForm,
  });
  const firstName = useField('firstName', form);
  const middleName = useField('middleName', form);
  const lastName = useField('lastName', form);
  const email = useField('email', form);
  const subscribed = useField('subscribed', form);

  return (
    <>
      <h1 className="level-left">Add member</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">First name</label>
          <div className="control">
            <input {...firstName.input} className={firstName.meta.touched
            && firstName.meta.error ? 'input is-danger' : 'input'} type="text" placeholder="First name..." />
          </div>
          {firstName.meta.touched
            && firstName.meta.error
            && <p className="help is-danger">{firstName.meta.error}</p>}
        </div>
        <div className="field">
          <label className="label">Middle name</label>
          <div className="control">
            <input {...middleName.input} className="input" type="text" placeholder="Middle name..." />
          </div>
        </div>
        <div className="field">
          <label className="label">Last name</label>
          <div className="control">
            <input {...lastName.input} className={lastName.meta.touched
            && lastName.meta.error ? 'input is-danger' : 'input'} type="text" placeholder="Last name..." />
          </div>
          {lastName.meta.touched
            && lastName.meta.error
            && <p className="help is-danger">{lastName.meta.error}</p>}
        </div>
        <div className="field">
          <label className="label">Email address</label>
          <div className="control">
            <input {...email.input} className={email.meta.touched
            && email.meta.error ? 'input is-danger' : 'input'} type="email" placeholder="Email address..." />
          </div>
          {email.meta.touched
            && email.meta.error
            && <p className="help is-danger">{email.meta.error}</p>}
        </div>
        <label className="checkbox">
          <input {...subscribed.input} type="checkbox" />
          {' Subscribed?'}
        </label>
        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit" disabled={pristine || submitting}>Create</button>
          </div>
        </div>
      </form>
      <pre>
        <code>
          {JSON.stringify(values, null, 2)}
        </code>
      </pre>
    </>
  );
};

export default ({ match }: RouteComponentProps) => {
  return (
    <div className="content">
      <Route path={match.path} exact component={MembersList} />
      <Route path={`${match.path}add/`} component={AddMember} />
    </div>
  );
};
