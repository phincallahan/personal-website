import * as m from 'mithril';

interface Attr {
    closeWindow: () => void
}

export const WindowButtons: m.Component<Attr> = {
    view: vnode => {
        const onclick = vnode.attrs.closeWindow;
        const onmousedown = e => e.stopPropagation();
        return m("td.window-buttons", [
            m("button.close-button", { onclick, onmousedown }, [
                m("i.icon-cancel-circled")
            ])
        ])
    }
}
