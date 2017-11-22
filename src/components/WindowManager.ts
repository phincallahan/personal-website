import * as m from "mithril";

import { State } from '../reducers';
import { Window as WindowComponent, WindowNode } from './Window';

interface Attr {
    windows: State['windows'];
    closeWindow: (key: string) => void
    focusWindow: (key: string) => void
    moveWindow: (key: string, x: number, y: number) => void
}

export const WindowManager: m.Component<Attr> = {
    view: vnode => {
        const { windows, closeWindow, focusWindow, moveWindow } = vnode.attrs;
        return m("div.window-manager", windows.map(w => 
            m(WindowComponent, {
                ...w, key: w.k,
                closeWindow, focusWindow, moveWindow, 
            })
        ))
    }
}