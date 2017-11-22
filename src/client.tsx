require('./stylesheets/main.scss');

import * as m from 'mithril';
import { store } from './store';

const root = document.body;

import { About } from './components';
import { Euler, Windows } from './containers';

const App: m.Component = { 
    view: vnode => m("main", [ m(About), m(Windows), m(Euler) ])
}

m.mount(root, App);