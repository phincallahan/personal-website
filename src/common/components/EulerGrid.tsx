import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as window from '../reducers/windows';
import * as euler from '../reducers/euler';

import { Store } from '../reducers';
import { EulerGridCell } from './EulerGridCell';

declare let _store: Store;

if(process.env && process.env.BROWSER) {
    require('../../stylesheets/components/_euler.scss');
}

interface GridProps {
    openWindow: (id: number) => void;
    problems: typeof _store.euler.problems;
    activeProblem: number;
}

export function renderCSS(problems: typeof _store.euler.problems) {
    const ROW_LENGTHS = [5, 10, 15, 20];

    const MARGIN = 100;
    const CELL_WIDTH = 28;
    const BORDER_WIDTH = 1;
    const MAX_PROBLEM = 500;

    let styles = {
        '.euler-grid-cell': {
            'width': CELL_WIDTH,
            'height': CELL_WIDTH,
            'line-height': CELL_WIDTH
        },
        '.euler-grid' : {}
    }

    for (let rowLength of ROW_LENGTHS) {
        let width = rowLength * CELL_WIDTH;
        let mediaQuery = `@media (min-width: ${width + MARGIN}px)`;

        styles[mediaQuery] = {
            '.euler-grid': { width }
        };

        for (let id = 1; id < MAX_PROBLEM; id++) {
            if (!problems[id]) {
                continue
            }

            let className = `.cell-${id}`;
            styles[mediaQuery][className] = {
                'border-width': '1px'
            };

            let top = Math.floor((id - 1) / rowLength) * (CELL_WIDTH + BORDER_WIDTH);
            let left = ((id - 1) % rowLength) * (CELL_WIDTH + BORDER_WIDTH);

            if (!problems[id - 1] || id % rowLength == 1) {
                styles[mediaQuery][className]['border-left-width'] = '2px';
                left = left - 1;
            }

            if (!problems[id + 1] || id % rowLength == 0) {
                styles[mediaQuery][className]['border-right-width'] = '2px';
            }

            if (!problems[id - rowLength]) {
                styles[mediaQuery][className]['border-top-width'] = '2px';
                top = top - 1;
            }

            if (!problems[id + rowLength]) {
                styles[mediaQuery][className]['border-bottom-width'] = '2px';
            }

            styles[mediaQuery][className].top = top + 'px';
            styles[mediaQuery][className].left = left + 'px';
        }
    }
    
    return styles;
}

class Grid extends React.Component<GridProps, void> {
    constructor(props: GridProps) {
        super(props)
    }

    render() {
        let gridCells: JSX.Element[] = [];
        
        for (let i in this.props.problems) {
            let id = Number(i);
            let problem = this.props.problems[id];
            gridCells.push(
                <EulerGridCell id = {id} key = {id}
                    solutions = {problem.solutions}
                    isActive = {id == this.props.activeProblem}
                    onClick = {() => {this.props.openWindow(id)}}/>
            )
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
        problems: state.euler.problems,
        activeProblem: state.euler.active,
        windows: state.windows
    }
}

function mapDispatchToProps(dispatch: Dispatch<Store>) {
    return {
        openWindow: (problemID: number) => {
            dispatch(window.actions.addEuler(problemID));
        }
    }
}

export const EulerGrid = connect(mapStateToProps, mapDispatchToProps)(Grid);