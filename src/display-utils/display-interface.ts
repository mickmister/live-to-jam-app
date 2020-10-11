import {from} from "rxjs";
import {AppState} from "../app/states/state";
const {AppState} = require('../app/states/state');

export interface IDisplay {
    displayState(state: AppState): void
}
