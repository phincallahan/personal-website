import * as m from 'mithril';

import * as r from 'redux';

import { Actions } from '../actions';

export interface State { 
    solutions: { [problem: number]: string[] }
    code: { [uri: string]: {
        isLoading: boolean,
        code?: string
        error?: Error 
    } }
};

type Action = Actions.RECEIVE_CODE | Actions.REQUEST_CODE;

let initState: State = { 
    solutions: require('../euler.json'), 
    code: {} 
};

export const reducer: r.Reducer<State> = (s = initState, a: Action) => {
    switch(a.type) {
        case "REQUEST_CODE":
            return {
                ...s,
                code: Object.assign({}, s.code, {
                    [a.uri]: { isLoading: true }
                })
            };
        case "RECEIVE_CODE":
            return {
                ...s, 
                code: Object.assign({}, s.code, {
                    [a.uri]: {
                        isLoading: false,
                        code: a.code
                    } 
                })
            };
        default:
            return s;
    }
}