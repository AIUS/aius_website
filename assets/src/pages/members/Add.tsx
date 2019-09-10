import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, useField, FieldRenderProps } from 'react-final-form-hooks';

import { useAuth } from '../../components/AuthProvider';
import PeriodList from '../../components/PeriodList';

interface FFProps {
  field: FieldRenderProps;
  label: string;
  placeholder?: string;
  type: string;
  className?: string;
}

const FormField: React.FunctionComponent<FFProps> = ({ field, label, placeholder, type, className }: FFProps) => (
  <div className={`field column is-marginless ${className}`}>
    <label className="label">{label}</label>
    <div className="control">
      <input
        {...field.input}
        className={field.meta.touched && field.meta.error ? 'input is-danger' : 'input'}
        type={type}
        placeholder={placeholder}
      />
    </div>
    {field.meta.touched && field.meta.error ? (
      <p className="help is-danger">{field.meta.error}</p>
    ) : (
      <p className="help">&nbsp;</p>
    )}
  </div>
);

interface FormValues {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  subscribed?: boolean;
  situation?: string;
  birthdate?: string;
}

type Props = RouteComponentProps;

const AddMember: React.FunctionComponent<Props> = ({ history }: Props) => {
  const { t } = useTranslation('user');
  const [period, setPeriod] = useState(-1);
  const { authenticatedFetch } = useAuth();
  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit(v: FormValues) {
      return authenticatedFetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: v.email,
            first_name: v.firstName,
            middle_name: v.middleName,
            last_name: v.lastName,
            subscribed: v.subscribed,
            birthdate: v.birthdate,
            memberships: [
              {
                period_id: period,
                valid: true,
                situation: v.situation,
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
    validate(values: FormValues): FormValues {
      const errors: FormValues = {};
      if (!values.firstName) {
        errors.firstName = t('required');
      }
      if (!values.lastName) {
        errors.lastName = t('required');
      }
      if (!values.situation) {
        errors.situation = t('required');
      }
      if (!values.birthdate) {
        errors.birthdate = t('required');
      }
      if (!values.email) {
        errors.email = t('required');
      } else if (!values.email.match(/.+@.+/)) {
        errors.email = t('valid_email');
      }
      return errors;
    },
  });
  const firstName = useField('firstName', form);
  const middleName = useField('middleName', form);
  const lastName = useField('lastName', form);
  const email = useField('email', form);
  const subscribed = useField('subscribed', form);
  const situation = useField('situation', form);
  const birthdate = useField('birthdate', form);

  return (
    <form onSubmit={handleSubmit}>
      <PeriodList selected={period} onChange={setPeriod} />
      <div className="columns is-desktop">
        <FormField field={firstName} label={t('first_name')} placeholder={t('first_name_example')} type="text" />
        <FormField field={middleName} label={t('middle_name')} placeholder={t('middle_name_example')} type="text" />
        <FormField field={lastName} label={t('last_name')} placeholder={t('last_name_example')} type="text" />
      </div>
      <div className="columns is-vcentered">
        <FormField field={email} label={t('email')} placeholder={t('email_example')} type="email" />
        <label className="checkbox column is-narrow">
          <input {...subscribed.input} type="checkbox" />
          {' ' + t('will_subscribe')}
        </label>
      </div>

      <div className="columns">
        <FormField field={birthdate} className="is-one-third" label={t('birthdate')} type="date" />
        <FormField field={situation} label={t('situation')} placeholder={t('situation_example')} type="text" />
      </div>
      <div className="field">
        <div className="control">
          <button className="button is-primary" type="submit" disabled={pristine || submitting}>
            {t('ui:submit')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddMember;
