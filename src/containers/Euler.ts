import { Dispatch } from 'redux';

import { connect } from '../connect';
import { State } from '../reducers';

import { openWindow, fetchEulerCode } from '../actions';

import { EulerGrid, EulerSolution } from '../components';

const state = (state: State) => ({
    solutions: state.euler.solutions
})

const actions = (dispatch: Dispatch<State>, getState: () => State) => ({
    openWindow: (problem: number, uris: string[]) => {
        uris.forEach(uri => dispatch(fetchEulerCode(uri)));

        const tabs = uris.map(uri => ({
            name: uri.replace('project-euler/', ''),
            component: EulerSolution,
            attr: () => getState().euler.code[uri]
        }))

        const k = `PROJECT_EULER_${problem}`;
        dispatch(openWindow(tabs, { k }));
    }
})

export const Euler = connect(state, actions)(EulerGrid);