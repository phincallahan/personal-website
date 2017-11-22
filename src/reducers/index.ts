import { combineReducers } from 'redux';

import * as windows from './windows';
import * as euler from './euler';

export interface State {
    windows: windows.State 
    euler: euler.State
}

export const reducer = combineReducers<State>({
    windows: windows.reducer,
    euler: euler.reducer
})