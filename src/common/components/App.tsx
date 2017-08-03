import * as React from 'react';

import { Route, Link } from 'react-router-dom';
import { Header } from './Header';
import { HeaderButton } from './HeaderButton';
import { About } from './About';
import { Euler } from './Euler';
import { PacmanGame as Pacman } from './Pacman';

class App extends React.Component<undefined, undefined> {
    constructor() {
        super();
    }

    render() {
        return (
            <main>
                {/* <Header>
                    <HeaderButton link="about"/>
                    <HeaderButton link="blog"/>
                    <HeaderButton link="euler"/> 
                </Header>    */}
                <About/>
                <Euler/>
            </main>
        )
    }
}

export default App;