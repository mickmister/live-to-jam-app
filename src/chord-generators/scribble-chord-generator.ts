import {note} from '@tonaljs/core';
const scribble = require('scribbletune');

import {Chord, MidiNote, Note} from "../types/model-interfaces";


export default class ScribbleChordGenerator {
    constructor() {
        scribble.addChord(['1P', '5P', '8P', '22P', '24M', '26P'], [], 'fullM');
        scribble.addChord(['1P', '5P', '8P', '22P', '24m', '26P'], [], 'fullm');
    }

    generateMinorChord = (name: string): Chord | null => {
        const chord = this.generateChord(name, 'fullm-2');
        if (!chord) {
            return null;
        }

        return {
            ...chord,
            name: name + ' Minor',
        };
    };

    generateMajorChord = (name: string): Chord | null => {
        const chord = this.generateChord(name, 'fullM-2');
        if (!chord) {
            return null;
        }

        return {
            ...chord,
            name: name + ' Major',
        };
    };

    generateChord = (name: string, chordModifier: string): Chord | null => {
        const chord = scribble.chord(name + chordModifier);
        if (!chord || !chord.length) {
            return null;
        }

        const notes: MidiNote[] = chord.map((n: string) => {
            const expanded = note(n);
            return {
                note: expanded.midi,
                velocity: 127,
            };
        });

        return {
            name,
            notes: [],
            midiNotes: notes,
        }
    };
}
