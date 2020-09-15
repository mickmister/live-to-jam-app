import {Subject} from 'rxjs';
const max = require('max-api') as MaxAPI;

import {MidiNote} from '../types/model-interfaces';

export default class AbletonIO {
    private midiInObservable = new Subject<MidiNote>();
    constructor() {
        max.addHandler<number>('note', (note, velocity) => {
            this.midiInObservable.next({note, velocity});
        });
    }

    onMidiIn = (callback: (midiNote: MidiNote) => void) => {
        this.midiInObservable.subscribe(callback);
    }

    sendMidi = (midiNotes: MidiNote[]) => {
        for (const midiNote of midiNotes) {
            max.outlet<number>(midiNote.note, midiNote.velocity);
        }
    }

    log = (message: string) => {
        max.post(message);
    }
}
