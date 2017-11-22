import * as r from 'redux';
import * as m from 'mithril';

const dispatchFactory = (creator, dispatch) => {
    return (...args) => dispatch(creator(...args));
}

export function createConnect<S>(store: r.Store<S>) {
    return (selector: (s: S) => any, actions?: any) =>
        (Component: m.Component): m.Component => ({
            view: vnode => {
                const { dispatch, getState } = store;

                let actionMap = {};
                if (typeof actions === 'function') {
                    actionMap = actions(dispatch, store.getState);
                } else if (typeof actions === 'object') {
                    const actionKeys = Object.keys(actions);
                    let k;
                    for (k of actionKeys) {
                        if (typeof actions[k] === 'function') {
                            actionMap[k] = dispatchFactory(actions[k], dispatch);
                        }
                    }
                }

                const state = selector(getState());
                const attrs = {
                    ...vnode.attrs,
                    ...state,
                    ...actionMap,
                    dispatch,
                }
                return m(Component, attrs, vnode.children);
            }
        });
}

export const redrawMiddleware: r.Middleware = () => (next) => (action) => {
    next(action);
    if ((action.redraw || (action.meta && action.meta.redraw)) && m) {
        m.redraw();
    }
};
