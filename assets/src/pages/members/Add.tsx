import React from 'react';
import { useForm, useField } from 'react-final-form-hooks';

const onSubmit = (): void => {};

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

const AddMember: React.FunctionComponent = () => {
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
            <input
              {...firstName.input}
              className={firstName.meta.touched && firstName.meta.error ? 'input is-danger' : 'input'}
              type="text"
              placeholder="First name..."
            />
          </div>
          {firstName.meta.touched && firstName.meta.error && <p className="help is-danger">{firstName.meta.error}</p>}
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
            <input
              {...lastName.input}
              className={lastName.meta.touched && lastName.meta.error ? 'input is-danger' : 'input'}
              type="text"
              placeholder="Last name..."
            />
          </div>
          {lastName.meta.touched && lastName.meta.error && <p className="help is-danger">{lastName.meta.error}</p>}
        </div>
        <div className="field">
          <label className="label">Email address</label>
          <div className="control">
            <input
              {...email.input}
              className={email.meta.touched && email.meta.error ? 'input is-danger' : 'input'}
              type="email"
              placeholder="Email address..."
            />
          </div>
          {email.meta.touched && email.meta.error && <p className="help is-danger">{email.meta.error}</p>}
        </div>
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
