import {Note, Chord, Scale, MidiNumber, Quality, MidiIO, Logger, MidiNote} from '../types/model-interfaces';
// import ChordProcessor, {cycle, SORTED_PITCHES} from './chord-processor';

import chords from './chord';
import {cycle, getAllOffMidiNotes, noteFromNumber} from '../utils/midi-utils';
import ScribbleChordGenerator from '../chord-generators/scribble-chord-generator';

export default class Master {
    private midiIO: MidiIO;
    private logger: Logger;

    private scaleRoot: MidiNumber;
    private scaleQuality: Quality;

    constructor(midiIO: MidiIO, logger: Logger) {
        this.midiIO = midiIO;
        this.logger = logger;

        this.scaleRoot = 50;
        this.scaleQuality = Quality.MAJOR;

        midiIO.onMidiIn((midiNote) => {
            if (midiNote.velocity === 0) {
                return;
            }

            this.playChordFromMidiNumber(midiNote.note);
        });
    }

    private playChordFromMidiNumber = (midiNumber: MidiNumber) => {
        const root = noteFromNumber(this.scaleRoot);
        const scale: Scale = {
            root,
            quality: this.scaleQuality,
        }

        const note = noteFromNumber(midiNumber);

        const gen = new ScribbleChordGenerator();
        const chord = gen.generateMajorChord(note.name);

        this.logger.log(JSON.stringify(chord));

        if (chord) {
            this.midiIO.sendMidi(chord.midiNotes);
        }
    }

    setScaleRoot = (midiNumber: MidiNumber) => {
        this.scaleRoot = midiNumber;
    }

    // Out of convenience for midi communication, C is major and everything else is minor
    setScaleQuality = (midiNumber: MidiNumber) => {
        if (cycle(midiNumber) === 0) {
            this.scaleQuality = Quality.MAJOR;
        } else {
            this.scaleQuality = Quality.MINOR;
        }
    }
}
