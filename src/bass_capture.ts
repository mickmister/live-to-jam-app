const chords = require('./chord');

enum Outlets {
    MIDI_ON = 'midi_on',
    MIDI_OFF = 'midi_off',
}

type MidiNote = {
    note: number;
    velocity: number;
}

const max = require('max-api') as MaxAPI;

let currentNote = {} as MidiNote;
const handleFullMidiNote = ((midiNote: MidiNote) => {
    const notes: number[] = chords(midiNote.note);
    for (const note of notes) {
        max.outlet<number>(note, midiNote.velocity);
    }
    currentNote = {} as MidiNote;
});

max.addHandler<number>('note', (note, velocity) => {
    currentNote = {note, velocity};
    if (currentNote.velocity !== undefined) {
        handleFullMidiNote(currentNote);
    }
});

max.addHandler<number>('velocity', (velocity) => {
    currentNote.velocity = velocity;
    if (currentNote.note !== undefined) {
        handleFullMidiNote(currentNote);
    }
});

max.addHandler('midiselect', (...args) => {
    max.post(args.toString());
});
