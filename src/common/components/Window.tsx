import * as React from 'react'
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { Store } from '../reducers';
import { BaseWindow } from '../reducers/windows';

interface WindowState {
    x: number;
    y: number;
}

interface WindowProps extends BaseWindow {
    isActive: boolean;
    closeWindow: (key: string) => void;
    focusWindow: (key: string) => void;
    moveWindow: (key: string, x: number, y: number) => void;
}

export class Window extends React.Component<WindowProps, WindowState> {
    constructor(props: WindowProps) {
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
                x: x0 + e2.screenX - x1,
                y: y0 + e2.screenY - y1
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
                    {this.props.children}
                </div>
            </div>
        )
    }
}