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

export default class ChordProcessor {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  findTriad = (notes: Note[]): Chord | void => {
    const sorted = notes.sort((n1, n2) => n1.number - n2.number)

    const root = sorted[0]

    const third = sorted.find(n => cycle(n.number) === cycle(root.number + 3) || cycle(n.number) === cycle(root.number + 4))
    if (!third) {
      return
    }
    const fifth = sorted.find(n => cycle(n.number) === cycle(root.number + 7))
    if (!fifth) {
      return
    }

    return {notes: [root, third, fifth]}
  }

  getRootModeChord = (scale: Scale, note: Note, octaveOffset: number): Chord | null => {
    // if (note.octave > 2) {
    //   return null
    // }

    if (!this.isNoteInScale(scale, note)) {
      this.logger.log('not in scale?');
      return {notes: []}
    }

    // const rootMod = note.number % 12
    // const inv = getInversion(scale, note, octaveOffset + 1)

    // const totalOffset = octaveOffset * 12

    // const root = noteFromNumber(rootMod + totalOffset)
    // const rootOctave = noteFromNumber(rootMod + totalOffset + 12)

    const inv = this.getInversion(scale, note, octaveOffset + 1)
    const totalOffset = octaveOffset * 12

    const root = this.noteFromNumber(note.number - 24)
    const rootOctave = this.noteFromNumber(note.number)
    // const rootOctave = noteFromNumber(note.number - 12)

    if (!inv) {
      return {notes: []};
    }

    const notes = [
      // root,
      // rootOctave,
      ...inv.notes,
    ]

    const unique: {[pitch: number]: Note} = {}
    notes.forEach(note => {
      unique[note.number] = note
    })

    return {
      notes: Object.values(unique),
    }
  }

  getInversion = (scale: Scale, note: Note, octaveOffset: number): Chord | null => {
    const rootMod = cycle(note.number)

    const thirdOffset = this.getThird(scale, note)

    // return {
    //   notes: [
    //     noteFromNumber(rootMod),
    //     noteFromNumber(rootMod + thirdOffset),
    //   ]
    // }

    if (rootMod === 3 || rootMod === 4) { // Eflat or E
      const fifthMod = cycle(rootMod + 7)
      const fifth = fifthMod + ((octaveOffset - 1) * 12)
      const upperRoot = fifth + 5
      const third = upperRoot + thirdOffset
      const upperOctave = fifth + 12

      return {
        notes: [
          this.noteFromNumber(fifth),
          this.noteFromNumber(upperRoot),
          this.noteFromNumber(third),
          this.noteFromNumber(upperOctave),
        ],
      }
    }
    else if (rootMod >= 5 && rootMod <= 8) { // F F# G G#
      const fifthMod = cycle(rootMod + 7)
      const fifth = fifthMod + (octaveOffset * 12)
      const upperRoot = fifth + 5
      const third = upperRoot + thirdOffset
      const upperOctave = fifth + 12

      return {
        notes: [
          this.noteFromNumber(fifth),
          this.noteFromNumber(upperRoot),
          this.noteFromNumber(third),
          this.noteFromNumber(upperOctave),
        ],
      }
    }

    else if (rootMod >= 9 && rootMod <= 11) { // A A# B
      const upperRoot = rootMod + ((octaveOffset - 1) * 12)
      const third = upperRoot + thirdOffset
      const fifth = upperRoot + 7
      const upperOctave = upperRoot + 12

      return {
        notes: [
          this.noteFromNumber(upperRoot),
          this.noteFromNumber(third),
          this.noteFromNumber(fifth),
          this.noteFromNumber(upperOctave),
        ],
      }
    }
    else { // C C# D
      const upperRoot = rootMod + (octaveOffset * 12)
      const third = upperRoot + thirdOffset
      const fifth = upperRoot + 7
      const upperOctave = upperRoot + 12

      return {
        notes: [
          this.noteFromNumber(upperRoot),
          this.noteFromNumber(third),
          this.noteFromNumber(fifth),
          this.noteFromNumber(upperOctave),
        ],
      }
    }
  }

  noteFromNumber = (noteNumber: number): Note => {
    const noteName = SORTED_PITCHES[cycle(noteNumber)]
    const octave = Math.floor((noteNumber - 24) / 12)

    return {
      number: noteNumber,
      name: noteName,
      octave,
    }
  }

  isNoteInScale = (scale: Scale, note: Note): boolean => {
    const diff = this.getNoteDiff(note.number, scale.root.number)

    const scaleDegrees = scale.quality === Quality.MAJOR ? MAJOR_ROOT_INDEXES : MINOR_ROOT_INDEXES
    return Boolean(diff.toString() in scaleDegrees)
  }

  getThird = (scale: Scale, note: Note): MidiNumberMod => {
    const diff = this.getNoteDiff(note.number, scale.root.number)

    const scaleDegrees = scale.quality === Quality.MAJOR ? MAJOR_ROOT_INDEXES : MINOR_ROOT_INDEXES
    const degreeQuality = scaleDegrees[diff.toString()];

    return degreeQuality === Quality.MAJOR ? 4 : 3
  }

  getNoteDiff = (num1: number, num2: number): MidiNumberMod => {
    const diff = (num1 + 12) - num2
    return diff % 12
  }
}
