import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as window from '../reducers/windows'
import * as euler from '../reducers/euler'

import { Store } from '../reducers';
import { Window } from './Window';
import { EulerPanel } from './EulerPanel';

interface WindowManagerProps {
    closeWindow: (key: string) => void;
    focusWindow: (key: string) => void;
    moveWindow: (key: string, x: number, y: number) => void;
    problems: euler.Problem[];
    windows: window.Window[];
}

class WM extends React.Component<WindowManagerProps, void> {
    render() {
        let windowFuncs = {
            closeWindow: this.props.closeWindow,
            focusWindow: this.props.focusWindow,
            moveWindow: this.props.moveWindow
        }

        let windows = this.props.windows.map((w, i) => {
            let contents: JSX.Element;
            switch(w.kind) {
                case "Euler":
                    let problem = this.props.problems[w.problemID];
                    contents = <EulerPanel {...problem}/>
                    break;
                case "Directory":
                    contents = <span>Directory</span>
                    break;
            }

            return (
                <Window key = {w.k}
                    isActive = {i + 1 == this.props.windows.length}
                    {...w} {...windowFuncs}>
                    {contents}
                </Window>
            );
        });

        return (
            <div className = 'window-manager'>
                {windows}
            </div>
       )
    }
}

function mapStateToProps(state: Store): any {
    return {
        windows: state.windows,
        problems: state.euler.problems
    }
}

function mapDispatchToProps(dispatch: Dispatch<Store>) {
    return {
        closeWindow: (key: string) => dispatch(window.actions.remove(key)),
        focusWindow: (key: string) => dispatch(window.actions.focus(key)),
        moveWindow:  (key: string, x: number, y: number) => 
            dispatch(window.actions.move({key, x, y}))
    }
}

export const WindowManager = connect(mapStateToProps, mapDispatchToProps)(WM);