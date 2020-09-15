import {Subject} from 'rxjs';
import {MidiNote} from '../types/model-interfaces';

import {onKeyPress} from '../utils/node-keyboard-input';

const scribble = require('scribbletune');

export default class NodeIO {
    private midiInObservable = new Subject<MidiNote>();
    constructor() {
        // whenever keystrokes are done in console
        // () => {
                // this.midiInObservable.next({note, velocity});
        // }

        onKeyPress(key => {
            const chord = scribble.chord(key.name.toUpperCase() + 'M');
            console.log(chord);
        });

        // const c = scribble.clip({
        //     pattern: 'xxxx', // or just x since we dont have any variation
        // });
        // scribble.midi(c);
    }

    onMidiIn = (callback: (midiNote: MidiNote) => void) => {
        this.midiInObservable.subscribe(callback);
    }

    sendMidi = (midiNotes: MidiNote[]) => {
        for (const midiNote of midiNotes) {
            console.log(midiNote);
        }
    }

    log = (message: string) => {
        console.log(message);
    }
}
