import * as React from 'react';

import { Route, Link } from 'react-router-dom';
import { Header } from './Header';
import { HeaderButton } from './HeaderButton';
import { About } from './About';
import { Euler } from './Euler';
import { PacmanGame as Pacman } from './Pacman';


const Main = () => (<div> <About/> <Euler/> </div>)

class App extends React.Component<undefined, undefined> {
    constructor() {
        super();
    }

    render() {
        return (
            <main>
                <Route exact path="/" component={Main}/>
                <Route path="/pacman" component={Pacman}/>
            </main>
        )
    }
}

export default App;