import {Subject} from 'rxjs';

import { note, interval } from '@tonaljs/core';

import {MidiNote} from '../types/model-interfaces';

import {onKeyPress} from '../utils/node-keyboard-input';
import {getAllOffMidiNotes} from '../utils/midi-utils';

const scribble = require('scribbletune');

const Server = require('socket.io');

import ScribbleChordGenerator from '../chord-generators/scribble-chord-generator';

export default class NodeIO {
    private midiInObservable = new Subject<MidiNote>();
    private io: typeof Server;
    private chordGenerator: ScribbleChordGenerator;

    constructor() {
        this.chordGenerator = new ScribbleChordGenerator();

        setTimeout(() => {
            this.io = new Server(3000, {
                // path: '/test',
                serveClient: false,
                // below are engine.IO options
                pingInterval: 10000,
                pingTimeout: 5000,
                cookie: false,
            });

            this.io.on('connection', function (socket: any) {
                console.log('socketid',socket.id,'connected');
                socket.on('msg', (data: any) => {
                });
                socket.on('disconnect', function () {
                    console.log(socket.id + ' disconnect');
                });
            });
        }, 0);

        onKeyPress(key => {
            const chord = this.chordGenerator.generateMajorChord(key.name.toUpperCase());

            if (chord) {
                this.midiInObservable.next(chord.midiNotes[0]);
            }
        });
    }

    onMidiIn = (callback: (midiNote: MidiNote) => void) => {
        this.midiInObservable.subscribe(callback);
    }

    sendMidi = (midiNotes: MidiNote[]) => {
        this.io.emit('notes', midiNotes);
    }

    releaseAllKeys() {
        const msg = {type: 'release-keys'};
        this.io.emit(JSON.stringify(msg));
    }

    log = (message: string) => {
        console.log(message);
    }
}
