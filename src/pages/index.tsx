import React from 'react';
import { Redirect } from '@reach/router';

const IndexPage = () => {
  return <Redirect to="/app" noThrow />;
};

export default IndexPage;
