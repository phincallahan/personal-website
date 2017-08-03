"use strict";
var redux_typescript_actions_1 = require("redux-typescript-actions");
var redux_typescript_actions_2 = require("redux-typescript-actions");
var actionCreator = redux_typescript_actions_1["default"]();
exports.actions = {
    add: actionCreator("WINDOW/ADD"),
    addEuler: function (problemID, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var newWindow = {
            x: x, y: y, problemID: problemID,
            title: "Problem " + problemID,
            kind: "Euler",
            k: Math.random().toString()
        };
        return exports.actions.add(newWindow);
    },
    remove: actionCreator("WINDOW/REMOVE"),
    focus: actionCreator("WINDOW/FOCUS"),
    move: actionCreator("WINDOW/MOVE")
};
exports.reducer = function (state, action) {
    if (state === void 0) { state = []; }
    if (redux_typescript_actions_2.isType(action, exports.actions.add)) {
        return state.concat([action.payload]);
    }
    if (redux_typescript_actions_2.isType(action, exports.actions.remove)) {
        var index = state.map(function (s) { return s.k; }).indexOf(action.payload);
        return state.slice(0, index).concat(state.slice(index + 1));
    }
    if (redux_typescript_actions_2.isType(action, exports.actions.focus)) {
        var index = state.map(function (s) { return s.k; }).indexOf(action.payload);
        return state.slice(0, index).concat(state.slice(index + 1), [
            state[index]
        ]);
    }
    return state;
};
