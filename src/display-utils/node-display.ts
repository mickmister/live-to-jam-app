const {terminal} = require('terminal-kit');

import {AppState} from '../app/states/state';
import {IDisplay} from './display-interface';

const term = terminal /* as {
    clear(): void;
    moveTo(x: number, y: number, text?: string): void;
    gridMenu(items: string[], callback?: any): void;
}*/

export default class NodeDisplay implements IDisplay {
    displayState = (state: AppState) => {
        term.clear();
        // term.moveTo(1, 1, ' --------------');
        // term.moveTo(1, 2, '|');
        // this.drawVerticalLine(3, 4, 10);

        // this.drawBox(2, 3, 15, 5);
        this.drawBoxWithText(5, 5, 'Hey dude whats up?');

        term.moveTo(1, 1);
    };

    drawVerticalLine = (x: number, startY: number, length: number) => {
        for (let i=startY; i<startY + length; i++) {
            term.moveTo(x, i, '|')
        }
    }

    drawHorizontalLine = (startX: number, y: number, length: number) => {
        for (let i=startX; i<startX + length+1; i++) {
            term.moveTo(i, y, '-')
        }
    }

    drawBox = (x: number, y: number, width: number, height: number) => {
        this.drawVerticalLine(x, y, height);
        this.drawVerticalLine(x + width, y, height);
        this.drawHorizontalLine(x, y, width);
        this.drawHorizontalLine(x, y + height, width);
    }

    drawBoxWithText = (x: number, y: number, text: string) => {
        const width = 40;
        const height = 5;
        const maxLettersPerRow = 40;

        this.drawBox(x, y, width, height);

        const numRows = text.length / maxLettersPerRow + 1;
        // const startX = (width - text.length) / 2 + x;
        // const startY = height / 2 + y;
        // term.moveTo(startX, startY, text);

        // for (let rowY = 0; rowY < numRows; rowY++) {
        //     const block =
        //     const startX = (width - text.length) / 2 + x;
        //     const startY = height / 2 + y;
        //     term.moveTo(startX, startY, text);
        // }

        term.moveTo(1, 1);

        const items = ['item1', 'item2', 'item3'];
        // term.gridMenu(items, {itemMaxWidth: 10});
        // term.singleColumnMenu(items, {itemMaxWidth: 10});
    }
}
