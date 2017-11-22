import * as m from 'mithril';
import * as r from 'redux';

import { Actions } from '../actions';

export type State = MiniWindow[];

type Action = 
    Actions.OPEN_WINDOW | 
    Actions.FOCUS_WINDOW | 
    Actions.CLOSE_WINDOW | 
    Actions.MOVE_WINDOW;

export const reducer: r.Reducer<State> = (s = [], a: Action) => {
    const index = s.findIndex(w => w.k === a.k);
    switch(a.type) {
        case "OPEN_WINDOW":
            let {x, y, tabs, k } = a;
            return [...s, {x, y, tabs, k}]
        case "FOCUS_WINDOW":
            return index === -1 ? s : [
                ...s.slice(0, index),
                ...s.slice(index + 1),
                s[index]
            ]
        case "CLOSE_WINDOW":
            return index === -1 ? s : [
                ...s.slice(0, index),
                ...s.slice(index + 1)
            ]
        case "MOVE_WINDOW":
            return index === -1 ? s : [
                ...s.slice(0, index),
                { ...s[index], x: a.x, y: a.y },
                ...s.slice(index + 1)
            ]
        default: 
            return s
    }
}
