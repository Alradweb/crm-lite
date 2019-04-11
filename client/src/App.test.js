import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
//"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm run client-install && npm run client --prefix client"
//"heroku-postbuild": "cd client && yarn && yarn run build"