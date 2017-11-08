import * as React from 'react';
import { render } from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom';
import { Home } from './components/Home';

require('./stylesheets/main.scss');

render(
    <Home/>,
    document.getElementById('root')
);