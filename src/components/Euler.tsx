import * as React from 'react';
import 'whatwg-fetch';

import { WindowContainer, WindowTab } from './Window';
import { EulerSolution } from './EulerSolution';

interface State {
    active: number;
    windows: {
        x: number;
        y: number;
        problem: number;
    }[];
}

export class Euler extends React.Component<{}, State> {
    static solutions = require('../euler.json');

    constructor() {
        super();

        this.state = {
            windows: [],
            active: -1
        }
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
        let { windows } = this.state;

        let s = [];
        for(let i = 1; i < 400; i++) {
            let isEmpty = Euler.solutions[i] === undefined;
            var props = {
                className: "euler-grid-cell",
                onClick: this.openWindow.bind(this, i)
            };

            s[i - 1] = (
                <div key = {i} {...isEmpty? {} : props}>
                    {isEmpty ? '' : i}
                </div>
            );
        }

        let w = windows.map((window, i) => {
            let props = {
                key: window.problem,
                x: window.x, y: window.y,
                isActive: i + 1 == this.state.windows.length,
                closeWindow: this.closeWindow.bind(this, i),
                focusWindow: this.focusWindow.bind(this, i),
                moveWindow: this.moveWindow.bind(this, i)
            }
        
            return (
                <WindowContainer {...props}>
                    {
                        Euler.solutions[window.problem].map(uri => ({
                            p: {
                                title: uri.replace('project-euler/', ''),
                                key: uri
                            },
                            u: uri
                        })).map(({p, u}) => 
                            <WindowTab {...p}>
                                <EulerSolution uri={u}/>
                            </WindowTab>
                        )
                    }
                </WindowContainer>
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