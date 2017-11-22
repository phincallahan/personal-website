import * as m from 'mithril';

interface Attr {
    activeIndex: number;
    tabs: Tab[];
}

export const WindowBody: m.Component<Attr> = {
    view: vnode => {
        const { tabs, activeIndex } = vnode.attrs;
        const { component, attr } = tabs[activeIndex];
        return m("td.window-body", { colSpan: 2 }, m(component, attr));
    }
}
