import actionCreatorFactory from 'redux-typescript-actions';
import {Action as ReduxAction} from 'redux';
import {isType, Action} from 'redux-typescript-actions';
import { Reducer } from 'redux';

const actionCreator = actionCreatorFactory();

export interface BaseWindow {
    x: number,
    y: number, 
    title: string,
    k: string,
    kind: string
}

interface EulerWindow extends BaseWindow {
    kind: 'Euler',
    problemID: number
}

interface DirectoryWindow extends BaseWindow {
    kind: 'Directory',
    name: string
}

export type Window = EulerWindow | DirectoryWindow;
export type State = Window[]

export const actions = {
    add: actionCreator<Window>("WINDOW/ADD"),
    addEuler: (problemID: number, x: number = 0, y: number = 0) => {
        let newWindow: EulerWindow = {
            x,y,problemID,
            title: `Problem ${problemID}`,
            kind: "Euler",
            k: Math.random().toString()
        };
        return actions.add(newWindow)
    },
    remove: actionCreator<string>("WINDOW/REMOVE"),
    focus: actionCreator<string>("WINDOW/FOCUS"),
    move:  actionCreator<{key: string, x: number, y: number}>("WINDOW/MOVE"),
}

export const reducer: Reducer<State> = (state: State = [], action: ReduxAction) => {
    if(isType(action, actions.add)) {
        return [...state, action.payload];
    } 

    if(isType(action, actions.remove)) {
        let index = state.map(s => s.k).indexOf(action.payload)
        return [
             ...state.slice(0, index),
             ...state.slice(index + 1)
        ]
    } 
    
    if(isType(action, actions.focus)) {
        let index = state.map(s => s.k).indexOf(action.payload)
        return [
            ...state.slice(0, index),
            ...state.slice(index + 1),
            state[index]
        ]
    }

    return state;
}