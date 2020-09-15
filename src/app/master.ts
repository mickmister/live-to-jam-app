import {Note, Chord, Scale, MidiNumber, Quality, MidiIO, Logger, MidiNote} from '../types/model-interfaces';
import ChordProcessor, {cycle, SORTED_PITCHES} from './chord-processor';

import chords from './chord';

export default class Master {
    private midiIO: MidiIO;
    private logger: Logger;
    private chordProcessor: ChordProcessor;

    private scaleRoot: MidiNumber;
    private scaleQuality: Quality;

    constructor(midiIO: MidiIO, logger: Logger) {
        this.midiIO = midiIO;
        this.logger = logger;
        this.chordProcessor = new ChordProcessor(logger);

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
        const root = this.chordProcessor.noteFromNumber(this.scaleRoot);
        const scale: Scale = {
            root,
            quality: this.scaleQuality,
        }

        debugger;

        const note = this.chordProcessor.noteFromNumber(midiNumber);

        this.midiIO.sendMidi(getAllOffMidiNotes());

        let toPlay: MidiNote[] = [];
        const inversion = this.chordProcessor.getRootModeChord(scale, note, 3);
        this.logger.log(JSON.stringify(scale));
        this.logger.log(JSON.stringify(note));

        if (inversion) {
            // this.logger.log(inversion.notes[0].number.toString());
            toPlay = inversion.notes.map((n) => ({
                note: n.number,
                velocity: 100,
            }));
        } else {
            this.logger.log('no root mode chord found');
            const chord = chords(midiNumber);
            toPlay = chord.map(note => ({note, velocity: 100}));
        }

        this.logger.log(JSON.stringify(toPlay));

        this.midiIO.sendMidi(toPlay);
    }

    setScaleRoot = (midiNumber: MidiNumber) => {
        this.scaleRoot = midiNumber;
    }

    // Out of convenience for midi communication, C is major and everything else is minor
    setScaleQuality = (midiNumber: MidiNumber) => {
        if (cycle(midiNumber) === 12) {
            this.scaleQuality = Quality.MAJOR;
        } else {
            this.scaleQuality = Quality.MINOR;
        }
    }
}

const getAllOffMidiNotes = () => {
    const result: MidiNote[] = [];
    for (let i=0; i < 128; i++) {
        result.push({
            note: i + 1,
            velocity: 0,
        });
    }
    return result;
}
