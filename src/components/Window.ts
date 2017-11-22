import * as m from 'mithril';

import { WindowBody, WindowTabs, WindowButtons } from '.';

function grabHeader(this: WindowNode, e1: MouseEvent) {
    const { x, y } = this.state;

    const mousemove = (e2: MouseEvent) => {
        this.state.x = Math.max(x + e2.screenX - e1.screenX, 0);
        this.state.y = Math.max(y + e2.screenY - e1.screenY, 0);
        m.redraw();
    };
    window.addEventListener('mousemove', mousemove);

    const mouseup = () => {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        this.attrs.moveWindow(this.attrs.k, this.state.x, this.state.y);
    }
    window.addEventListener('mouseup', mouseup);
};


interface Attr {
    tabs: Tab[];
    x?: number;
    y?: number;
    k: string;
    closeWindow: (key: string) => void;
    focusWindow: (key: string) => void;
    moveWindow: (key: string, x: number, y: number) => void;
}

interface State {
    x: number;
    y: number;
    activeIndex: number;
}

export type WindowNode = m.Vnode<Attr, State>

export const Window: m.Component<Attr, State> = {
    oninit: vnode => {
        const { x, y } = vnode.attrs;
        vnode.state.x = x || document.body.clientWidth / 2;
        vnode.state.y = y || document.body.clientHeight / 2;
        vnode.state.activeIndex = 0;
    },

    view: vnode => {
        const { x, y } = vnode.state;
        const style = { top: `${y}px`, left: `${x}px` };

        const tab = vnode.attrs.tabs[vnode.state.activeIndex];
        const attr = typeof tab.attr === "function" 
            ? tab.attr() 
            : tab.attr;

        const key = vnode.attrs.k;
        const focusWindow = () => vnode.attrs.focusWindow(key);
        const closeWindow = () => vnode.attrs.closeWindow(key);

        return m("div.window-frame", { style }, [
            m("table.window", { onmousedown: focusWindow }, [
                m("tbody", [
                    m("tr.window-header", { onmousedown: grabHeader.bind(vnode) }, [
                        m(WindowTabs, {
                            names: vnode.attrs.tabs.map(t => t.name),
                            activeIndex: vnode.state.activeIndex,
                            setTab: i => { vnode.state.activeIndex = i; m.redraw() }
                        }),
                        m(WindowButtons, { closeWindow })
                    ]),
                    m("tr", m("td.window-body", { colSpan: 2 }, [
                        m(tab.component, attr)
                    ]))
                ])
            ])
        ])
    }
}
