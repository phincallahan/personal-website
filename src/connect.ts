import { store } from './store';
import { createConnect } from './mithril-redux';

export const connect = createConnect(store);