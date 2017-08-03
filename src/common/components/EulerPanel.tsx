import * as React from 'react';
import { connect } from 'react-redux';

import { Store } from '../reducers'

namespace EulerPanel {
    export interface Props {
        solutions: Store["euler"]["solutions"][number]
    }
}

export const EulerPanel = (props: EulerPanel.Props) => {
    return <div className="euler-panel">
        { props.solutions.map((sol,i) => <pre key={i}>{sol.code}</pre>)}
    </div>
}