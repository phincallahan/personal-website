import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { Store } from '../reducers';
import { Window as WindowTypes } from '../reducers';

namespace Window {
    export interface Props extends WindowTypes.Base {
        isActive: boolean;
        closeWindow: (key: string) => void;
        focusWindow: (key: string) => void;
        moveWindow: (key: string, x: number, y: number) => void;
    }

    export interface State {
        x: number;
        y: number;
        tab?: number;
    }
}

export class Window extends React.Component<Window.Props, Window.State> {
    constructor(props: Window.Props) {
        super(props);

        this.state = {
            x: this.props.x,
            y: this.props.y
        };
    }

    grabHeader = (e1: React.MouseEvent<HTMLDivElement>) => {
        if((e1.target as HTMLElement).className == 'close-button') {
            return
        }

        const x0 = this.state.x;
        const y0 = this.state.y;
        const x1 = e1.screenX;
        const y1 = e1.screenY;

        let handler = (e2: MouseEvent) => {
            this.setState({
                x: Math.max(x0 + e2.screenX - x1, 0),
                y: Math.max(y0 + e2.screenY - y1, 0)
            });
        }
        
        window.addEventListener('mousemove', handler);
        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', handler);
        })
    }

    render() {
        let position = {
            left: this.state.x,
            top: this.state.y
        }

        let className = classNames('code-window', {
            'active-window': this.props.isActive
        })

        return (
            <div className = {className}
                style = {position}
                onMouseDown = {e =>
                    this.props.focusWindow(this.props.k)}
                >
                <div className = "header"
                    onMouseDown = {this.grabHeader}>
                    <span className = "window-title">{this.props.title}</span>
                    <button className = "close-button"
                        onClick = {e => {
                            this.props.closeWindow(this.props.k)
                        } }>
                        X</button>
                </div>
                <div className = "body">
                    <div className = "left-edge"> </div>
                    <div className = "bottom-edge"> </div>
                    <div className = "right-edge"> </div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}