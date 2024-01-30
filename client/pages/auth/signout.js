import { useEffect } from 'react';
import UseRequest from '../../hooks/use-request';
import Router from 'next/router';

export default () => {
  const { doRequest } = UseRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <h1>Signing you out...</h1>;
};
