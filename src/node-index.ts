import NodeIO from './connectors/node-io';
import Master from './app/master';

const nodeIO = new NodeIO();

import NodeDisplay from './display-utils/node-display';
import {IDisplay} from './display-utils/display-interface';
const display = new NodeDisplay()
display.displayState({});

// const master = new Master(nodeIO, nodeIO);
setTimeout(() => {
    nodeIO.listen();
}, 0);
