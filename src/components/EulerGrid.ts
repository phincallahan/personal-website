import * as m from 'mithril'

import { State } from '../reducers';

interface Attr {
    solutions: State['euler']['solutions']
    openWindow: (problem: number, uris: string[]) => void
}

export const EulerGrid: m.Component<Attr> = {
    view: vnode => {
        const { solutions, openWindow } = vnode.attrs;
        const cells = [];
        for (let i = 1; i < 400; i++) {
            if (solutions[i] === undefined) {
                cells[i - 1] = m("div");
            } else {
                let attr = { 
                    onclick: () => openWindow(i, solutions[i])
                }
                cells[i - 1] = m("div.euler-grid-cell", attr, i);
            }
        }

        return m("section#euler", [
            m("h4", "Project Euler"),
            m("div.euler-grid", cells)
        ]);
    }
}