import { Dispatch, Action as ReduxAction } from 'redux';
import { Component, request } from 'mithril';
import { ThunkAction } from 'redux-thunk';

import * as Actions from './types';

import { State } from '../reducers';

let k = 0;
interface Opts {
    x?: number;
    y?: number;
    k?: string;
}

function openWindow<T>(tabs: Tab[], opts: Opts): Actions.OPEN_WINDOW {
    return {
        type: "OPEN_WINDOW",
        tabs,
        x: opts.x || document.body.clientWidth / 2,
        y: opts.y || document.body.clientHeight / 2,
        k: opts.k || "" + k++
    }
}

const focusWindow = (k: string): Actions.FOCUS_WINDOW => ({
    type: "FOCUS_WINDOW", k
});

const closeWindow = (k: string): Actions.CLOSE_WINDOW => ({
    type: "CLOSE_WINDOW", k
})

const moveWindow = (k: string, x: number, y: number): Actions.MOVE_WINDOW => ({
    type: "MOVE_WINDOW", k, x, y
})

const requestCode = (uri: string): Actions.REQUEST_CODE => ({
    type: "REQUEST_CODE", uri
})

const recieveCode = (uri: string, code: string): Actions.RECEIVE_CODE => ({
    type: "RECEIVE_CODE", uri, code, redraw: true
})

const fetchEulerCode = (uri: string): ThunkAction<void, State, void> => {
    return (dispatch, getState) => {
        dispatch(requestCode(uri));
        request(uri, { deserialize: x => x })
            .then(code => {
                dispatch(recieveCode(uri, code));
            });
    }
}

export { 
    closeWindow, focusWindow, openWindow, 
    moveWindow, fetchEulerCode, Actions 
}