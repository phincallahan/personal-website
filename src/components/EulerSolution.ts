import * as m from 'mithril';

const Loaded: m.Component<{code: string}> = {
    view: vnode =>
        m("pre.euler-code-wrapper", m.trust(vnode.attrs.code))
}

const Err: m.Component<{err: Error}> = {
    view: vnode =>
        m("div.euler-code-wrapper", [
            `Unable to load code: ${vnode.attrs.err.toString()}`
        ])
}

interface Attr {
    isLoading?: boolean;
    code?: string;
    err?: Error;
}

export const EulerSolution: m.Component<Attr> = {
    view: vnode => {
        const { err, code } = vnode.attrs;
        if (err !== undefined) {
            return m(Err, {err})
        } else if (vnode.attrs.code) {
            return m(Loaded, {code})
        } else {
            return m("div.euler-code-wrapper", "Loading...");
        }
    }
}