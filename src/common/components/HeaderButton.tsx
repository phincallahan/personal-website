import * as React from 'react';
import { Link } from 'react-router-dom';

interface HeaderButtonProps {
    link: string;
}

export const HeaderButton = (props: HeaderButtonProps) => (
    <h1 className="nav-item"> <Link to={'/' + props.link}>{props.link}</Link></h1>
)