import { createStore, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { redrawMiddleware } from './mithril-redux';

import { reducer, State } from './reducers';

const middleware = applyMiddleware(thunkMiddleware, redrawMiddleware);
export const store = middleware<State>(createStore)(reducer);