"use strict";
var redux_1 = require("redux");
var windows_1 = require("./windows");
var euler_1 = require("./euler");
var reducer = redux_1.combineReducers({
    "windows": windows_1.reducer,
    "euler": euler_1.reducer
});
exports.configureStore = function (initialData) {
    return redux_1.createStore(reducer, initialData);
};
