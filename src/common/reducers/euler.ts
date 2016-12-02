import { Action as ReduxAction, Reducer } from 'redux';
import { createSelector } from 'reselect';

export interface Problem {
    id: number;
    solutions: {
        ext: string;
        code: string;
    }[];
}

export interface State {
    problems: {[id: number]: Problem};
    active: number;
}

const initialState = {
    active: -1,
    problems: {}
}

export const reducer: Reducer<State> = (state: State = initialState, action: ReduxAction) => state