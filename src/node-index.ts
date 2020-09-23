import NodeIO from './connectors/node-io';
import Master from './app/master';

const nodeIO = new NodeIO();

const master = new Master(nodeIO, nodeIO);
