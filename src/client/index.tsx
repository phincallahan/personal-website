import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import { configureStore, Store } from '../common/reducers';
import routes from  '../common/routes'

type MyAction = Action<"HEY", string, number>;

declare global {
    interface Window {
        $REDUX_STATE: Object;
        $EULER_STATE: Object;
        $RENDERED_CLASSNAMES: string[];
    }
}

let initState = {} as Store;
for(let key in window.$REDUX_STATE) {
    initState[key] = window.$REDUX_STATE[key];
}

console.log(initState);

const store = configureStore(initState);

render(
  <Provider store={store}>
      <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('react-view')
);