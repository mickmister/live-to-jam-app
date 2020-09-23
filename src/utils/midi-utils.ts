import {MidiNote} from '../types/model-interfaces';

import {Note, Chord, Scale, Quality, Logger, MidiNumber, MidiNumberMod} from '../types/model-interfaces'

export const SORTED_PITCHES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const ACCIDENTAL_PITCHES = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];
const PITCH_INDEXES: {[name: string]: number} = {
  'C': 0,
  'C#': 1,
  'Db': 1,
  'D': 2,
  'D#': 3,
  'Eb': 3,
  'E': 4,
  'F': 5,
  'F#': 6,
  'Gb': 6,
  'G': 7,
  'G#': 8,
  'Ab': 8,
  'A': 9,
  'A#': 10,
  'Bb': 10,
  'B': 11,
}

const MAJOR_ROOT_INDEXES: {[index: string]: Quality} = {
  '0': Quality.MAJOR,
  '2': Quality.MINOR,
  '4': Quality.MINOR,
  '5': Quality.MAJOR,
  '7': Quality.MAJOR,
  '9': Quality.MINOR,
}

const MINOR_ROOT_INDEXES = {
  '0': Quality.MINOR,
  '3': Quality.MAJOR,
  '5': Quality.MINOR,
  '7': Quality.MINOR,
  '8': Quality.MAJOR,
  '10': Quality.MAJOR,
}

export const cycle = (x: number) => x % 12

export const getAllOffMidiNotes = () => {
    const result: MidiNote[] = [];
    for (let i=0; i < 128; i++) {
        result.push({
            note: i + 1,
            velocity: 0,
        });
    }
    return result;
}

export const noteFromNumber = (noteNumber: number): Note => {
    const noteName = SORTED_PITCHES[cycle(noteNumber)]
    const octave = Math.floor((noteNumber - 24) / 12)

    return {
      number: noteNumber,
      name: noteName,
      octave,
    }
  }

export const isNoteInScale = (scale: Scale, note: Note): boolean => {
    const diff = getNoteDiff(note.number, scale.root.number)

    const scaleDegrees = scale.quality === Quality.MAJOR ? MAJOR_ROOT_INDEXES : MINOR_ROOT_INDEXES
    return Boolean(diff.toString() in scaleDegrees)
  }

export const getThird = (scale: Scale, note: Note): MidiNumberMod => {
    const diff = getNoteDiff(note.number, scale.root.number)

    const scaleDegrees = scale.quality === Quality.MAJOR ? MAJOR_ROOT_INDEXES : MINOR_ROOT_INDEXES
    const degreeQuality = scaleDegrees[diff.toString()];

    return degreeQuality === Quality.MAJOR ? 4 : 3
  }

export const getNoteDiff = (num1: number, num2: number): MidiNumberMod => {
    const diff = (num1 + 12) - num2
    return diff % 12
};
