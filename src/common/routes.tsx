import * as React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import { About } from './components/About';
import { Euler } from './components/Euler';

export default (
    <Route component={App} path = "/">
        <IndexRoute component={About} />
        <Route path="about" component={About}/>
        <Route path ="euler" component ={Euler}/>
    </Route>
)