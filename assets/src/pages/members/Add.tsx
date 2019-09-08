import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useForm, useField, FieldRenderProps } from 'react-final-form-hooks';

import { useAuth } from '../../components/AuthProvider';
import PeriodList from '../../components/PeriodList';

interface FFProps {
  field: FieldRenderProps;
  label: string;
  placeholder: string;
  type: string;
}

const FormField: React.FunctionComponent<FFProps> = ({ field, label, placeholder, type }: FFProps) => (
  <div className="field">
    <label className="label">{label}</label>
    <div className="control">
      <input
        {...field.input}
        className={field.meta.touched && field.meta.error ? 'input is-danger' : 'input'}
        type={type}
        placeholder={placeholder}
      />
    </div>
    {field.meta.touched && field.meta.error && <p className="help is-danger">{field.meta.error}</p>}
  </div>
);

interface FormValues {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  subscribed?: boolean;
}

const validateForm = (values: FormValues): FormValues => {
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

type Props = RouteComponentProps;

const AddMember: React.FunctionComponent<Props> = ({ history }: Props) => {
  const [period, setPeriod] = useState(-1);
  const { token } = useAuth();
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit(v: FormValues) {
      return fetch('/api/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: v.email,
            first_name: v.firstName,
            middle_name: v.middleName,
            last_name: v.lastName,
            subscribed: v.subscribed,
            memberships: [
              {
                period_id: period,
                valid: true,
              },
            ],
          },
        }),
      })
        .then(r => r.json())
        .then(r => {
          if (r.errors || !r.data) throw new Error(r.errors);

          history.push(`/members/${r.data.id}`);
        });
    },
    validate: validateForm,
  });
  const firstName = useField('firstName', form);
  const middleName = useField('middleName', form);
  const lastName = useField('lastName', form);
  const email = useField('email', form);
  const subscribed = useField('subscribed', form);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <PeriodList selected={period} onChange={setPeriod} />
        <FormField field={firstName} label="First name" placeholder="John" type="text" />
        <FormField field={middleName} label="Middle name" placeholder="Bob" type="text" />
        <FormField field={lastName} label="Last name" placeholder="Doe" type="text" />
        <FormField field={email} label="Email address" placeholder="john.doe@example.com" type="email" />
        <label className="checkbox">
          <input {...subscribed.input} type="checkbox" />
          {' Subscribed?'}
        </label>
        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit" disabled={pristine || submitting}>
              Create
            </button>
          </div>
        </div>
      </form>
      <pre>
        <code>{JSON.stringify(values, null, 2)}</code>
      </pre>
    </>
  );
};

export default AddMember;
