export interface Note {
  number: number // i.e. 84
  name: string // i.e. "C"
  octave: number // i.e. 5
}

export interface Chord {
  notes: Note[]
}

export interface Scale {
  root: Note
  quality: string
}

export interface Progression {
  chords: Chord[]
}

export interface NoteCollection {
  notes: Note[]
}

export type MidiNumber = number
export type MidiNumberMod = number

export const noteToMidiNumber = (note: Note) => {
  return note.number
}

export enum Quality {
  MAJOR = 'Major',
  MINOR = 'Minor',
};

export type MidiNote = {
  note: number;
  velocity: number;
}

export interface MidiIO {
  onMidiIn(callback: (note: MidiNote) => void): void;
  sendMidi(midiNotes: MidiNote[]): void;
}

export interface Logger {
  log(message: string): void;
}
