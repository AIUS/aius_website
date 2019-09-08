import React from 'react';
import { Redirect } from 'react-router-dom';

const Home: React.FunctionComponent = () => <Redirect to="/members/add/" />;

export default Home;
