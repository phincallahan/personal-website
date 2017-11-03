import * as React from 'react';

interface Props {
    x: number, 
    y: number,
    title: string,
    isActive: boolean;
    closeWindow: () => void;
    focusWindow: () => void;
    moveWindow: (x: number, y: number) => void;
}

interface State {
    x: number;
    y: number;
}

export class Window extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            x: this.props.x,
            y: this.props.y
        };
    }

    private moveHandler: EventListener;
    removeHandler = (e: Event) => {
        window.removeEventListener('mousemove', this.moveHandler);
        window.removeEventListener('mouseup', this.removeHandler);
        this.props.moveWindow(this.state.x, this.state.y)
    }

    grabHeader = (e1: React.MouseEvent<HTMLDivElement>) => {
        if((e1.target as HTMLElement).className == 'close-button') {
            return
        }

        const x0 = this.state.x;
        const y0 = this.state.y;
        const x1 = e1.screenX;
        const y1 = e1.screenY;

        this.moveHandler = (e2: MouseEvent) => {
            this.setState({
                x: Math.max(x0 + e2.screenX - x1, 0),
                y: Math.max(y0 + e2.screenY - y1, 0)
            });
        }

        window.addEventListener('mousemove', this.moveHandler);
        window.addEventListener('mouseup', this.removeHandler);
    }

    render() {
        let className = "code-window " + (this.props.isActive 
            ? "active-window"
            : "")

        let props = {
            className,
            onMouseDown: this.props.focusWindow,
            style: {
            left: this.state.x,
                top: this.state.y
            },
        }

        return (
            <div {...props}>
                <div className = "header" onMouseDown = {this.grabHeader}>
                    <span className = "window-title">{this.props.title}</span>
                    <button className = "close-button" onClick = {this.props.closeWindow}> X </button>
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