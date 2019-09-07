import React, { Suspense } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';

import MembersList from './members/List';
import AddMember from './members/Add';

type Props = RouteComponentProps;

const Members: React.FunctionComponent<Props> = ({ match }: Props) => {
  return (
    <div className="content">
      <Suspense fallback="Loading…">
        <Switch>
          <Route path={match.path} exact component={MembersList} />
          <Route path={`${match.path}add/`} component={AddMember} />
        </Switch>
      </Suspense>
    </div>
  );
};

export default Members;
