declare interface Action<T extends string, P, M> {
    type: T;
    payload: P;
    meta: M;
}

declare var WEBPACK_IS_CLIENT: boolean;
