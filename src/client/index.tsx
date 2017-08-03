import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { configureStore, Store } from '../common/reducers';

import App from '../common/components/App';

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

const store = configureStore(initState);
 
render(
  <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
  </Provider>, 
  document.getElementById('react-view')
);