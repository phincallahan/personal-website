import * as m from 'mithril';

interface Attr {
    activeIndex: number;
    names: string[];
    setTab: (number) => void;
}

export const WindowTabs: m.Component<Attr> = {
    view: vnode => {
        const { names, setTab, activeIndex } = vnode.attrs;
        const children = names.map((n, i) => {
            const attrs = {
                onclick: () => setTab(i),
                onmousedown: (e: MouseEvent) => e.stopPropagation()
            }
            return i === activeIndex
                ? m("div.window-tab-active", attrs, n)
                : m("div.window-tab", attrs, n);
        });

        return m("td.window-tabs", children);
    }
}