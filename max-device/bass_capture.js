const chords = require('./chord');
var Outlets;
(function (Outlets) {
    Outlets["MIDI_ON"] = "midi_on";
    Outlets["MIDI_OFF"] = "midi_off";
})(Outlets || (Outlets = {}));
const max = require('max-api');
let currentNote = {};
const handleFullMidiNote = ((midiNote) => {
    const notes = chords(midiNote.note);
    for (const note of notes) {
        max.outlet(note, midiNote.velocity);
    }
    currentNote = {};
});
max.addHandler('note', (note, velocity) => {
    currentNote = { note, velocity };
    if (currentNote.velocity !== undefined) {
        handleFullMidiNote(currentNote);
    }
});
max.addHandler('velocity', (velocity) => {
    currentNote.velocity = velocity;
    if (currentNote.note !== undefined) {
        handleFullMidiNote(currentNote);
    }
});
max.addHandler('midiselect', (...args) => {
    max.post(args.toString());
});
