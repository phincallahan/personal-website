import * as React from 'react';
import { Link } from 'react-router';

interface HeaderButtonProps {
    link: string;
}

export const HeaderButton = (props: HeaderButtonProps) => (
    <h1>
        <Link to={`${props.link}`}>{props.link}</Link>
    </h1>
)