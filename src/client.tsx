import * as React from 'react';
import { render } from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom';
import { Home } from './components/Home';

render(
    <BrowserRouter>
        <main>
            <Route exact path="/" component={Home}/>
        </main>
    </BrowserRouter>,
    document.getElementById('root')
);