import * as React from 'react';

const Loaded = ({code}) => (
    <pre className="euler-code-wrapper">
        <code dangerouslySetInnerHTML={{__html: code}}/>
    </pre>
)

const Error = ({err}) => (
    <div className="euler-code-wrapper">
        Unable to load code: {err.toString()}
    </div>
)
const Loading = () => (
    <div className="euler-code-wrapper">Loading...</div>
)

interface State {
    code: string | null;
    err: any;
}

interface Props { 
    uri: string;
}

export class EulerSolution extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { code: null, err: null };
    }

    componentWillMount() {
        fetch(this.props.uri)
            .then(r => r.text())
            .then(code => this.setState({ code }))
            .catch(err => this.setState({ err }))
    }

    render() {
        if (this.state.err !== null) {
            return <Error err={this.state.err}/>
        } else if (this.state.code) {
            return <Loaded code={this.state.code}/>
        } else {
            return <Loading/>
        }
    }
}