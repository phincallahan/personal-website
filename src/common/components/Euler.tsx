import * as React from 'react';

import { EulerGrid } from './EulerGrid';
import { WindowManager } from './WindowManager';

export const Euler = () => (
    <section id="euler">
        <h3>Euler</h3>
         <WindowManager/> 
        <EulerGrid/>
    </section>
)
    