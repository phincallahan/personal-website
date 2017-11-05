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
    x?: number;
    y?: number;
}

export class Window extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            x: this.props.x || document.body.clientWidth / 2,
            y: this.props.y || document.body.clientHeight / 2
        };
    }

    private moveHandler: EventListener;
    removeHandler = (e: Event) => {
        console.log("mouse up");
        window.removeEventListener('mousemove', this.moveHandler);
        window.removeEventListener('mouseup', this.removeHandler);
        this.props.moveWindow(this.state.x, this.state.y)
    }

    grabHeader = (e1: React.MouseEvent<HTMLElement>) => {
        if ((e1.target as HTMLElement).className == 'close-button') {
            return
        }

        const x0 = this.state.x;
        const y0 = this.state.y;
        const x1 = e1.screenX;
        const y1 = e1.screenY;

        console.log("PRINT");

        this.moveHandler = (e2: MouseEvent) => {
            console.log("MOVE");
            this.setState({
                x: Math.max(x0 + e2.screenX - x1, 0),
                y: Math.max(y0 + e2.screenY - y1, 0)
            });
        }

        window.addEventListener('mousemove', this.moveHandler);
        window.addEventListener('mouseup', this.removeHandler);
    }

    render() {
        let className = "window " + (this.props.isActive
            ? "active-window"
            : "");

        let style = {
            left: this.state.x,
            top: this.state.y
        }

        console.log(style);

        return (
            <div className="window-frame" style={style}>
                <table className={className} onMouseDown={this.props.focusWindow}>
                    <tbody>
                        <tr className="window-header" onMouseDown = {this.grabHeader}>
                            <td className="window-title">
                                {this.props.title}
                            </td>
                            <td className="window-buttons">
                                <button className="close-button" onClick={this.props.closeWindow}>
                                    <i className="icon-cancel-circled"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="window-body" colSpan={2}> {this.props.children} </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}