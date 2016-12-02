import * as React from 'react';
import { connect } from 'react-redux';

import * as euler from '../reducers/euler';

export const EulerPanel = (props: euler.Problem) => (
    <div className="euler-panel">
        { props.solutions.map((sol,i) => <pre key={i}>{sol.code}</pre>)}
    </div>
)