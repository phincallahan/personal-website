import * as React from 'react';

type ReactTab = React.ReactElement<{ title: string, children: React.ReactChildren }>;
const isArray = (a): a is Array<ReactTab> => a.forEach !== undefined;

interface TabsProps {
    i: number;
    tabs: ReactTab[];
    setTab: (number) => void;
}

const Tabs = ({i, tabs, setTab}: TabsProps) =>
    <td className="window-tabs">
        {
            tabs.map((t, index) => ({
                p: {
                    key: t.props.title,
                    className: index === i
                        ? "window-tab-active"
                        : "window-tab",
                    onClick: () => setTab(index)
                },
                c: t.props.title
            })).map(({ p, c }) => <div {...p}>{c}</div>)
        }
    </td>

interface BodyProps {
    i: number;
    tabs: ReactTab[];
}

const Body = ({i, tabs}: BodyProps) => 
    <td className="window-body" colSpan={2}>
        { 
            tabs.map((t, index) => ({
                p: {
                    style: {
                        display: index == i 
                            ? "initial" 
                            : "none",
                    },
                    key: t.props.title
                },
                c: t.props.children
            })).map(({p, c}) => <div {...p}>{c}</div>)
        }
    </td>

interface CloseButtonProps {
    closeWindow: () => void
}

const Buttons = ({closeWindow}: CloseButtonProps) => 
    <td className="window-buttons">
        <button className="close-button" onClick={closeWindow}>
            <i className="icon-cancel-circled"></i>
        </button>
    </td>

interface WindowProps {
    i: number;
    tabs: ReactTab[];
    x: number;
    y: number
    setTab: (number) => void;
    grabHeader: React.MouseEventHandler<HTMLTableRowElement>
    closeWindow: () => void;
    focusWindow: () => void;
}

const Window = (props: WindowProps) => {
    return (
        <div className="window-frame" style={{top: props.y, left: props.x}}>
            <table className="window" onMouseDown={props.focusWindow}>
                <tbody>
                    <tr className="window-header" onMouseDown={props.grabHeader}>
                        <Tabs {...props}/>
                        <Buttons {...props}/>
                    </tr>
                    <tr>
                        <Body {...props}/>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

interface Props {
    x: number,
    y: number,
    isActive: boolean;
    closeWindow: () => void;
    focusWindow: () => void;
    moveWindow: (x: number, y: number) => void;
}

interface State {
    x: number;
    y: number;
    i: number;
}

export const WindowTab = ({ title: string }) => <div></div>

export class WindowContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            x: this.props.x || document.body.clientWidth / 2,
            y: this.props.y || document.body.clientHeight / 2,
            i: 0
        };
    }

    private moveHandler: EventListener;
    removeHandler = (e: Event) => {
        window.removeEventListener('mousemove', this.moveHandler);
        window.removeEventListener('mouseup', this.removeHandler);
        this.props.moveWindow(this.state.x, this.state.y)
    }

    isCloseButton = (target: HTMLElement) => {
        return target.classList.contains('close-button') ||
            target.parentElement.classList.contains('close-button');
    }

    grabHeader = (e1: React.MouseEvent<HTMLElement>) => {
        if ((e1.target as any).classList && this.isCloseButton(e1.target as HTMLElement)) {
            this.props.closeWindow();
            return e1.stopPropagation();
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
        let props = {
            ...this.props,
            ...this.state,
            tabs: this.props.children as Array<ReactTab>,
            grabHeader: this.grabHeader,
            setTab: i  => this.setState({i})
        }

        return <Window {...props}/>
    }
}