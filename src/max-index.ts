const max = require('max-api') as MaxAPI;

import AbletonIO from './connectors/ableton-io';
import Master from './app/master';
const ableton = new AbletonIO();

const master = new Master(ableton, ableton);
