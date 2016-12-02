import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reducer as windows, State as WindowState } from './windows';
import { reducer as euler, State as EulerState } from './euler';

export interface Store {
    windows: WindowState
    euler: EulerState
}

const reducer = combineReducers<Store>({
    "windows": windows,
    "euler": euler
});

export const configureStore = (initialData: Store) => 
    createStore<Store>(reducer, initialData);