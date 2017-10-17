import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Store, actions } from '../reducers';
import { EulerGridCell } from './EulerGridCell';

declare let _store: Store;

if (WEBPACK_IS_CLIENT) {
    require('../../stylesheets/euler.scss');
}

interface GridProps {
    openWindow: (id: number) => void;
    problems: typeof _store.euler.solutions;
    activeProblem: number;
}

const FillerCell = (key: number) => <div key={key}></div>
const GridCell = (key: number) => <div key={key}>{key}</div>

class Grid extends React.Component<GridProps, undefined> {
    constructor(props: GridProps) {
        super(props)
    }

    render() {
        let gridCells: JSX.Element[] = [];

        let max = 0;
        for(let i in this.props.problems) { 
            if (parseInt(i) > max) max = parseInt(i);
        }
        
        for(let i = 1; i <= max; i++) {
            let cell: JSX.Element;
            if (this.props.problems[i]) {
                cell = (
                    <div className="euler-grid-cell" 
                         key={i} 
                         onClick={() => this.props.openWindow(i)}
                    >
                        {i}
                    </div>
                )
            } else {
                cell = <div key={i}></div>
            }

            gridCells.push(cell);
        }

        return (
            <div className = 'euler-grid'> 
                { gridCells } 
            </div>
        );
    }
}

function mapStateToProps(state: Store): any {
    return {
        problems: state.euler.solutions,
        activeProblem: state.euler.active,
        windows: state.windows
    }
}

function mapDispatchToProps(dispatch: Dispatch<Store>) {
    return {
        openWindow: (problemID: number) => {
            dispatch(actions.window.addEuler(problemID));
        }
    }
}

export const EulerGrid = connect(mapStateToProps, mapDispatchToProps)(Grid);