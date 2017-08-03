import * as React from 'react';

if(process.env && process.env['BROWSER']) {
    require('../../stylesheets/header.scss');
}

export const Header = (props) => (
    <header>
        <nav>
            {props.children}
        </nav>
    </header>
)