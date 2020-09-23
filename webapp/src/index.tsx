import * as React from 'react';
import ReactDOM from 'react-dom';

import io from 'socket.io-client';

import SoundfontOutput from './midi_devices/outputs/soundfont-output';
import {OutputDevice} from './types/interfaces';
import {MidiNote} from './types/model-interfaces';

class Main extends React.PureComponent {
    player: OutputDevice;
    state = {
        message: null,
    }

    componentDidMount() {
        const url = 'ws://127.0.0.1:3000';
        const webSocket = io(url);
        webSocket.on('notes', (event: MidiNote[]) => {
            this.setState({message: event});
            this.player.playChord({
                notes: event.map((n) => ({number: n.note})),
            })
        });
    }

    setPlayer = () => {
        this.player = new SoundfontOutput();
    }

    render() {
        const {message} = this.state;

        return (
            <div>
                <button onClick={this.setPlayer}>
                    {'Start'}
                </button>
                {'Oh hey'}
                {message && JSON.stringify(message)}
            </div >
        );
    }
}
window.addEventListener('load', () => {
    ReactDOM.render(<Main />, document.getElementById('main'));
});
