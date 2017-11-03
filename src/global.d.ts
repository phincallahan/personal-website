declare interface Action<T extends string, P, M> {
    type: T;
    payload: P;
    meta: M;
}

declare var WEBPACK_IS_CLIENT: boolean;

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
