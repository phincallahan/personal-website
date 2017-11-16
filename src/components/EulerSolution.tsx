import * as React from 'react';


const Loaded = ({solutions}) => (
    <pre className="euler-code">
    {
        solutions.map(({code, uri}) => ({
            key: uri,
            dangerouslySetInnerHTML: {__html: code}
        })).map(props => <code {...props}></code>)
    }
    </pre>
)

const Error = ({err}) => (
    <div>Unable to load code: {err.toString()}</div>
)

const Loading = () => (
    <div>Loading...</div>
)

interface State {
    solutions: string[] | null;
    err: any;
}

interface Props { 
    uris: string[];
}

export class EulerSolution extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            solutions: null,
            err: null
        }
    }

    componentWillMount() {
        const reqs = this.props.uris.map(uri => {
            return fetch(uri)
                .then(r => r.text())
                .then(code => ({code, uri}));
        });

        Promise.all(reqs).then(solutions => {
            this.setState(() => ({ solutions }))
        }).catch(err => {
            this.setState(() => ({ err }))
        });
    }

    render() {
        if (this.state.err !== null) {
            return <Error err={this.state.err}/>
        } else if (this.state.solutions) {
            return <Loaded solutions={this.state.solutions}/>
        } else {
            return <Loading/>
        }
    }
}