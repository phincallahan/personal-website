import { Component } from 'mithril';
import { State } from '../reducers';

declare global {
    interface Tab {
        name: string
        attr: object | (() => object)
        component: Component
    }

    interface MiniWindow {
        tabs: Tab[]
        x: number
        y: number
        k: string
    }
}


export type OPEN_WINDOW = { type: "OPEN_WINDOW" } & MiniWindow
export type FOCUS_WINDOW = { type: "FOCUS_WINDOW", k: string }
export type CLOSE_WINDOW = { type: "CLOSE_WINDOW", k: string }
export type MOVE_WINDOW = { 
    type: "MOVE_WINDOW", 
    k: string,
    x: number,
    y: number
}

export type REQUEST_CODE = { type: "REQUEST_CODE", uri: string }
export type RECEIVE_CODE = { 
    type: "RECEIVE_CODE"
    redraw: true
    code: string 
    uri: string 
}