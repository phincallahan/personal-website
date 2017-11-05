import * as React from 'react';
import 'whatwg-fetch';

import { Window } from './Window';

interface State {
    active: number;
    windows: {
        x: number;
        y: number;
        problem: number;
    }[];
    solutions: {
        code: string;
        ext: string;
    }[][];
}

export class Euler extends React.Component<{}, State> {
    constructor() {
        super();

        this.state = {
            solutions: [],
            windows: [],
            active: -1
        }

        fetch('/assets/euler.json')
            .then(r => r.json())
            .then(s => {
                let solutions = []
                for (let i = 1; i < 400; i++) {
                    solutions.push(s[i]);
                }

                this.setState({ solutions })
            })
    }

    focusWindow = (index: number) => {
        if (index < this.state.windows.length - 1) {
            this.setState({
                windows: [
                    ...this.state.windows.slice(0, index),
                    ...this.state.windows.slice(index + 1),
                    this.state.windows[index]
                ]
            })
        }
    }

    closeWindow = (index: number) => {
        this.setState({
            windows: [
                ...this.state.windows.slice(0, index),
                ...this.state.windows.slice(index + 1)
            ]
        })
    }

    openWindow = (problem: number) => {
        const windows = this.state.windows;
        let index = windows.findIndex(w => w.problem === problem)

        if (index !== -1) {
            this.focusWindow(index);
        } else {
            const x = document.body.clientWidth / 2;
            const y = document.body.clientHeight / 2;
            this.setState({ 
                windows: [...windows,  { problem, x, y } ] 
            });
        }
    }

    moveWindow = (index: number, x: number, y: number) => {
        this.setState({
            windows: [
                ...this.state.windows.slice(0, index),
                { x, y, ...this.state.windows[index] },
                ...this.state.windows.slice(index + 1)
            ]
        })
    }

    render() {
        let { solutions, windows } = this.state;

        let s = solutions.map((solution, i) => {
            let isEmpty = solution === undefined;
            var props = {
                className: "euler-grid-cell",
                onClick: this.openWindow.bind(this, i + 1)
            };

            return (
                <div key = {i + 1} {...isEmpty? {} : props}>
                    {isEmpty ? '' : i + 1}
                </div>
            );
        })

        let w = windows.map((window, i) => {
            let solution = solutions[window.problem - 1];

            let windowContents = solution.map(({code}) => code)

            let props = {
                key: window.problem,
                x: window.x, y: window.y,
                title: `Problem ${window.problem}`,
                isActive: i + 1 == this.state.windows.length,
                closeWindow: this.closeWindow.bind(this, i),
                focusWindow: this.focusWindow.bind(this, i),
                moveWindow: this.moveWindow.bind(this, i)
            }

            return (
                <Window {...props}>
                    <pre className="euler-code">
                        <code> 
                            { solution.map(({code}) => code) } 
                        </code>
                    </pre>
                </Window>
            );
        });

        return (
            <section id="euler">
                <h4>Project Euler</h4>
                <div className = 'window-manager'> {w} </div>
                <div className = 'euler-grid'> {s} </div>
            </section>
        );
    }
}