import { connect } from '../connect';
import { State } from '../reducers';
import { closeWindow, focusWindow, moveWindow } from '../actions';
import { WindowManager } from '../components';

const state = (state: State) => ({ windows: state.windows });
const actions = { closeWindow, focusWindow, moveWindow };

export const Windows = connect(state, actions)(WindowManager);