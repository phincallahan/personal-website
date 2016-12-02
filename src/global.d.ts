declare interface Action<T extends string, P, M> {
    type: T;
    payload: P;
    meta: M;
}