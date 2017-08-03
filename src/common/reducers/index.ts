import { combineReducers, createStore, applyMiddleware } from 'redux';
import actionCreatorFactory from 'redux-typescript-actions';
import {isType, Action} from 'redux-typescript-actions';
import { Action as ReduxAction, Reducer } from 'redux';
import thunk from 'redux-thunk';

import { Euler } from '../models/ProjectEuler'

export interface Store {
    windows: Window[]
    euler: {
        solutions: {
            [id: number]: Euler.Solution[]
        }
        active: number;
    }
}

const initialState = {
    active: -1,
    solutions: {}
}

export const eulerReducer: Reducer<Store["euler"]> = (state = initialState, action: ReduxAction) => state


const actionCreator = actionCreatorFactory();

export namespace Window {
    export interface Base {
        x: number,
        y: number, 
        title: string,
        k: string,
        kind: string
    }

    export interface Euler extends Base {
        kind: 'Euler',
        problemID: number
    }

    export interface Directory extends Base {
        kind: 'Directory',
        name: string
    }
}

export type Window = Window.Euler | Window.Directory;

export const actions = {
    window: {
        add: actionCreator<Window>("WINDOW/ADD"),
        addEuler: (problemID: number, x: number = 0, y: number = 0) => {
            let newWindow: Window.Euler = {
                x,y,problemID,
                title: `Problem ${problemID}`,
                kind: "Euler",
                k: Math.random().toString()
            };
            return actions.window.add(newWindow)
        },
        remove: actionCreator<string>("WINDOW/REMOVE"),
        focus: actionCreator<string>("WINDOW/FOCUS"),
        move:  actionCreator<{key: string, x: number, y: number}>("WINDOW/MOVE"),
    }
}

export const windowReducer: Reducer<Store["windows"]> = (state = [], action: ReduxAction) => {
    if(isType(action, actions.window.add)) {
        return [...state, action.payload];
    } 

    if(isType(action, actions.window.remove)) {
        let index = state.map(s => s.k).indexOf(action.payload)
        return [
             ...state.slice(0, index),
             ...state.slice(index + 1)
        ]
    } 
    
    if(isType(action, actions.window.focus)) {
        let index = state.map(s => s.k).indexOf(action.payload)
        return [
            ...state.slice(0, index),
            ...state.slice(index + 1),
            state[index]
        ]
    }

    return state;
}

const reducer = combineReducers<Store>({
    "windows": windowReducer,
    "euler": eulerReducer
});

export const configureStore = (initialData: Store) => createStore<Store>(reducer, initialData);