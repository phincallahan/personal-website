import * as React from 'react';

import { Header } from './Header';
import { HeaderButton } from './HeaderButton';

class App extends React.Component<void, void> {
    constructor() {
        super();
    }

    render() {
        return (
            <main>
                <Header>
                    <HeaderButton link="about"/>
                    <HeaderButton link="blog"/>
                    <HeaderButton link="euler"/>
                </Header>
                {this.props.children}
            </main>
        )
    }
}

export default App;