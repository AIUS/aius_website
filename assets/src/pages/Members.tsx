import React, { Suspense } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import MembersList from './members/List';
import AddMember from './members/Add';
import ViewMember from './members/View';

type Props = RouteComponentProps;

const Members: React.FunctionComponent<Props> = ({ match }: Props) => {
  const { t } = useTranslation('ui');
  return (
    <div className="content">
      <Suspense fallback={t('loading')}>
        <Switch>
          <Route path={match.path} exact component={MembersList} />
          <Route path={`${match.path}add/`} component={AddMember} />
          <Route path={`${match.path}:userId`} component={ViewMember} />
        </Switch>
      </Suspense>
    </div>
  );
};

export default Members;
