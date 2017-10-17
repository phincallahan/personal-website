import * as React from 'react';

if(WEBPACK_IS_CLIENT) {
    console.log(WEBPACK_IS_CLIENT);
    require('../../stylesheets/header.scss');
}

export const Header = (props) => (
    <header>
        <nav>
            {props.children}
        </nav>
    </header>
)