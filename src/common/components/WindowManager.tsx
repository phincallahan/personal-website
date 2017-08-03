import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Store, actions } from '../reducers';
import { Window } from './Window';
import { EulerPanel } from './EulerPanel';

namespace WindowManager {
    export interface Props {
        closeWindow: (key: string) => void;
        focusWindow: (key: string) => void;
        moveWindow: (key: string, x: number, y: number) => void;
        solutions: Store["euler"]["solutions"];
        windows: Store["windows"];
    }
}

class WM extends React.Component<WindowManager.Props, undefined> {
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
                    let s = this.props.solutions[w.problemID]
                    contents = <EulerPanel solutions={s}/>
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
        solutions: state.euler.solutions
    }
}

function mapDispatchToProps(dispatch: Dispatch<Store>) {
    return {
        closeWindow: (key: string) => dispatch(actions.window.remove(key)),
        focusWindow: (key: string) => dispatch(actions.window.focus(key)),
        moveWindow:  (key: string, x: number, y: number) => 
            dispatch(actions.window.move({key, x, y}))
    }
}

export const WindowManager = connect(mapStateToProps, mapDispatchToProps)(WM);