import * as React from 'react';
import * as classNames from 'classnames'

import { Store } from '../reducers';
declare let _store: Store;

interface EulerGridCellProps {
    isActive: boolean;
    onClick: () => void;
    id: number;    
    solutions: {
        ext: string;
        code: string;
    }[];
}

export class EulerGridCell extends React.Component<EulerGridCellProps, undefined> {
    constructor(props: EulerGridCellProps) {
        super(props);
    }

    render() {
        let className = classNames(
            `cell-${this.props.id}`,    
            'euler-grid-cell', {
                'active': this.props.isActive,
            }
        )

        this.props.isActive ? 'euler-code active' : 'euler-code';
        return (
            <div className = {className}
                 onClick = {this.props.onClick} >
                <span>{this.props.id}</span>
            </div> 
        )
    }
}