module.exports = (midiNote: number): number[] => {
    return [
        midiNote,
        midiNote + 4,
        midiNote + 7,
    ]
}
